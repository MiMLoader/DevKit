import init from "./lib/init";
import build from "./lib/build";

const args: string[] = process.argv.slice(2);

switch (args[0]) {
    case 'init': {
        await init(args);
        break;
    }
    case 'build': {
        await build(args);
        break;
    }
    default: {
        console.log('Unknown command');
        console.log('Usage: devkit <command> [options]');
        console.log('Commands:');
        console.log('  init    Initialize a new project');
        console.log('  build   Build the project');
        console.log('Options:');
        console.log('  -y      Skip prompts');
        console.log('  --outdir <path>   Output directory');
    }
}