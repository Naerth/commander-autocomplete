import { promises as fs, readdirSync } from 'fs';
import { program } from '../..';

program.name("example")

const git = program.command("git");

git.command("clone")
git.command("commit")
git.command("push");


program.command("ls")
    .autocomplete(async () => {
        const directoryContent = await fs.readdir(process.cwd(), "utf-8");
        return directoryContent.sort();
    })

program.command("lsSync")
    .autocomplete(() => {
        const directoryContent = readdirSync(process.cwd(), "utf-8");
        return directoryContent.sort();
    })


program.parse(process.argv);