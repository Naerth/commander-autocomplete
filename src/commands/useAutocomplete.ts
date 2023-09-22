import { cleanupOption, setupOption, setupBash, cleanUpBash } from "../utils";
import { autocomplete } from "./autocomplete";
import { Command } from "./command";

export function useAutocomplete(program: Command) {

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

    program.command("completion", { hidden: true }).action(autocomplete);
}