import init from "./lib/init";
import build from "./lib/build";

const args: string[] = process.argv.slice(2);
if (args.includes('init')) {
    await init(args);
} else if (args.includes('build')) {
    await build(args);
} else {
    console.log('Unknown command');
    console.log('Usage: devkit <command> [options]');
    console.log('Commands:');
    console.log('  init    Initialize a new project');
    console.log('  build   Build the project');
    console.log('Options:');
    console.log('  -y      Skip prompts');
    console.log('  --outdir <path>   Output directory');
    process.exit(1);
};