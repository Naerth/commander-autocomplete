import { cleanUpBash } from "../utils/cleanup.js";
import { cleanupOption, setupOption } from "../utils/options.js";
import { setupBash } from "../utils/setup.js";
import { autocomplete } from "./autocomplete.js";
import { Command } from "./command.js";

export function enableAutocomplete(program: Command) {

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

    program.command("completion", { hidden: true }).action(async (...args: any[]) => {
        const words = await autocomplete(...args);
        if (words) console.log(words.join(" "));
    });
}