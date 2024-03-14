import * as prompts from "@clack/prompts";
import * as fs from "fs-extra";
import path from "node:path";
import { zip } from "compressing";
import { version } from '../../package.json';

export default async (args: string[]) => {
    prompts.intro(`Using devkit@${version} to build your project.`);

    const modJson = await fs.readJson('mod.json').catch((e) => {
        prompts.log.error(`Error building project: reading mod.json. Error: ${e.message}`);
        process.exit(1);
    });

    const output: string = args.includes('--outdir') ? args[args.indexOf('--outdir') + 1] : 'dist';

    prompts.log.info(`Building project to ${path.join(output, modJson.name)}@${modJson.version}.zip`);

    const zipSpinner = prompts.spinner();
    zipSpinner.start('Packaging project...');
    fs.ensureDirSync(output);

    await zip.compressDir(__dirname, path.join(output, `${modJson.name}@${modJson.version}.zip`)).catch((e) => {
        zipSpinner.stop('Error packaging project.');
        prompts.log.error(`Error building project: zipping. Error: ${e.message}`);
        process.exit(1);
    });

    zipSpinner.stop('Project packaged.');

    prompts.outro(`Project built to ${path.join(output, modJson.name)}@${modJson.version}.zip`);
};
