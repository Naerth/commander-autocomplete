import { cleanupOption, setupOption, setupBash, cleanUpBash } from "../utils";
import { autocompletion } from "./autocompletion";
import { Command } from "./command";

export function useAutocompletion(program: Command) {

    program.addOption(setupOption);
    program.addOption(cleanupOption);


    if (process.argv.includes(`--${setupOption.name()}`)) {
        setupBash(program.name())
        process.exit(0);
    }

    if (process.argv.includes(`--${cleanupOption.name()}`)) {
        cleanUpBash(program.name())
        process.exit(0);
    }

    program.command("completion", { hidden: true }).action(autocompletion);
}