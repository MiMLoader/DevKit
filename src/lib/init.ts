import * as prompts from "@clack/prompts";
import * as fs from "fs-extra";
import { version } from '../../package.json';
import type { Mod } from "../../types";

export default async (args: string[]) => {
    prompts.intro(`Using devkit@${version} to build your project.`);

    let modJson: Mod = {
        name: process.cwd().split('/').pop() as string,
        description: '',
        author: 'Unknown',
        version: '1.0.0',
        homepage: '',
        preload: false,
        main: 'index.js',
        priority: 1,
        dependencies: [],
        tags: [],
    };

    if (!args.includes('-y')) {
        modJson = {
            name: await prompts.text({
                message: 'Project name',
                initialValue: process.cwd().split('/').pop(),
                validate(value) {
                    if (value.length < 0) return 'The project name is required.';
                },
            }) as string,
            description: await prompts.text({
                message: 'Description',
                defaultValue: ''
            }) as string,
            author: await prompts.text({
                message: 'Author',
                defaultValue: 'Unknown'
            }) as string,
            version: await prompts.text({
                message: 'Version',
                initialValue: '1.0.0',
                validate(value) {
                    if (!value.match(/^\d+\.\d+\.\d+$/)) return 'Please enter a valid version number.';
                },
            }) as string,
            homepage: await prompts.text({
                message: 'Homepage',
                defaultValue: ''
            }) as string,
            preload: await prompts.text({
                message: 'Preload (empty or relative path)',
            }) as string,
            main: await prompts.text({
                message: 'Main',
                initialValue: 'index.js',
            }) as string,
            priority: Number(await prompts.text({
                message: 'Priority',
                initialValue: '1',
                validate(value) {
                    if (Number.isNaN(Number(value))) return 'Please enter a valid number.';
                },
            })),
            dependencies: await prompts.text({
                message: 'Description (separated with ", ")',
            }) as string,
            tags: await prompts.text({
                message: 'Tags (separated with ", ")',
            }) as string,
        };
    }

    modJson.preload ||= false;
    if (modJson.dependencies && modJson.dependencies.length > 0) {
        modJson.dependencies = String(modJson.dependencies).split(', ');
    } else {
        modJson.dependencies = [];
    }
    if (modJson.tags && modJson.tags.length > 0) {
        modJson.tags = String(modJson.tags).split(', ');
    } else {
        modJson.tags = [];
    }

    const modJsonSpinner = prompts.spinner();
    modJsonSpinner.start('Writing mod.json');
    await fs.writeJson('mod.json', modJson, { spaces: 2, EOL: '\n' });
    modJsonSpinner.stop('mod.json written.');

    fs.ensureFileSync(modJson.main);
    fs.ensureDirSync('assets');

    prompts.outro('Project initialized.');
    return true;
};