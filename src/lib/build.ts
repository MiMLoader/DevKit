import * as prompts from "@clack/prompts";
import * as fs from "fs-extra";
import path from "node:path";
import { zip } from "compressing";
import { version } from '../../package.json';
import type { Mod } from "../../types";

export default async (args: string[]) => {
    prompts.intro(`Using devkit@${version} to build your project.`);

    const modJson: Mod = await fs.readJson('mod.json').catch((e) => {
        prompts.log.error(`Error building project: reading mod.json. Error: ${e.message}`);
        process.exit(1);
    });
    const output: string = args.includes('--outdir') ? args[args.indexOf('--outdir') + 1] : 'dist';

    prompts.log.info(`Building project to ${modJson.author}+${path.join(output, modJson.name)}@${modJson.version}.zip`);

    const zipSpinner = prompts.spinner();

    zipSpinner.start('Packaging project...');
    fs.ensureDirSync(output);

    await zip.compressDir(import.meta.dirname, path.join(output, `${modJson.author}+${modJson.name}@${modJson.version}.zip`)).catch((e) => {
        zipSpinner.stop('Error packaging project.');
        prompts.log.error(`Error building project: zipping. Error: ${e.message}`);
        process.exit(1);
    });

    zipSpinner.stop('Project packaged.');

    prompts.outro(`Project built to ${output}/${modJson.author}+${modJson.name}@${modJson.version}.zip`);
};
