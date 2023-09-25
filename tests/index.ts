import { program } from '../src';

program.name("example");

program
    .command("git")
    .autocomplete(({ lastWord }) => ["--help", "--version", "clone", "commit", "push", lastWord]);

program.parse();