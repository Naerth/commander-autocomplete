import { getVisibleCommands } from "../utils/helpers.js";
import { Command } from "./command.js";

/**
 * Provides autocomplete for command-line interfaces built with the Commander.js library.
 * @param commanderArgs - The arguments passed to the autocomplete function.
 * @returns A promise that resolves to an array of strings to be used for autocomplete.
 */
export async function autocomplete(...commanderArgs: any[]) {

    const { parent, args } = (commanderArgs.pop() as Command);

    const wPrevious = [...args.splice(1)];
    const lastWord = wPrevious.slice(-1)[0];


    if (!parent)
        return;

    let activeCommand: Command = parent;

    for (let i = 0; i < wPrevious.length; i++) {

        const subLeaf = getVisibleCommands(activeCommand).find(cmd => cmd.name() === wPrevious[i]);
        if (subLeaf)
            activeCommand = subLeaf;

    }

    const autoCompleteWords = [
        ...getVisibleCommands(activeCommand).map(leaf => leaf.name()),
        ...await activeCommand.complete?.() ?? []
    ];

    if (autoCompleteWords.length > 0) {
        if (
            wPrevious.length === 0
            || activeCommand.name() === lastWord
            || autoCompleteWords.some(cmd => cmd.includes(lastWord) && cmd !== lastWord)
        )
            return console.log(autoCompleteWords.join(" "))
    }
}