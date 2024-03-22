import { promises as fs, readdirSync } from 'fs';
import { program } from '../../src/index';

program.name("example");

const git = program.command("git");

git.command("clone");
git.command("commit");
git.command("push");


program.command("ls")
    .option('-l, --long', 'long listing')
    .option('-a, --all', 'list all files')
    .autocomplete(async () => {
        const directoryContent = await fs.readdir(process.cwd(), "utf-8");
        return directoryContent.sort();
    });

program.command("lsSync")
    .option('-h, --human-readable', 'human readable sizes')
    .option('-r, --reverse', 'reverse order')
    .autocomplete(() => {
        const directoryContent = readdirSync(process.cwd(), "utf-8");
        return directoryContent.sort();
    });


program.parse(process.argv);