import * as prompts from "@clack/prompts";
import * as fs from "fs-extra";
import { version } from '../../package.json';

export default async (args: string[]) => {
    prompts.intro(`Using devkit@${version} to build your project.`);

    let modJson: any = {};
    if (args.includes('-y')) {
        modJson = {
            name: process.cwd().split('/').pop(),
        };
    }

    if (!args.includes('-y')) {
        modJson = {
            name: await prompts.text({
                message: 'Project name',
                initialValue: process.cwd().split('/').pop(),
                validate(value) {
                    if (value.length < 0) return 'The project name is required.';
                },
            }),
            description: await prompts.text({
                message: 'Description',
            }),
            author: await prompts.text({
                message: 'Author',
            }),
            version: await prompts.text({
                message: 'Version',
                initialValue: '1.0.0',
                validate(value) {
                    if (!value.match(/^\d+\.\d+\.\d+$/)) return 'Please enter a valid version number.';
                },
            }),
            homepage: await prompts.text({
                message: 'Homepage',
                initialValue: 'https://'
            }),
            preload: await prompts.text({
                message: 'Preload (empty or relative path)',
            }),
            main: await prompts.text({
                message: 'Main',
                initialValue: 'index.js',
            }),
            module: await prompts.confirm({
                message: 'Module?',
                initialValue: false,
            }),
            dependencies: [],
            priority: Number(await prompts.text({
                message: 'Priority',
                initialValue: '0',
                validate(value) {
                    if (Number.isNaN(Number(value))) return 'Please enter a valid number.';
                },
            }))
        };
    }

    modJson.author ||= 'Unknown';
    modJson.description ||= '';
    modJson.homepage ||= '';
    modJson.preload ||= '';
    modJson.main ||= 'index.js';
    modJson.module ||= false;
    modJson.priority ||= 0;
    modJson.version ||= '1.0.0';
    modJson.name = modJson.name.toString().replace(/ /g, '-');

    const modJsonSpinner = prompts.spinner();
    modJsonSpinner.start('Writing mod.json');
    await fs.writeJson('mod.json', modJson, { spaces: 2, EOL: '\n' });
    modJsonSpinner.stop('mod.json written.');

    fs.writeFileSync('index.js', `// Path: index.js\nconsole.log('Loading ${modJson.name}');\n\n(() => {\n\n})();`);

    fs.ensureDirSync('assets');

    prompts.outro('Project initialized.');
    return true;
};