import { Command } from "./command.js";

/**
 * Provides autocomplete for command-line interfaces built with the Commander.js library.
 * @param commanderArgs - The arguments passed to the autocomplete function.
 * @returns A promise that resolves to an array of strings to be used for autocomplete.
 */
export async function autocomplete(...commanderArgs: any[]): Promise<string[] | undefined> {

    const command = (commanderArgs.pop() as Command);
    const { parent, args } = command;
    const allWords = args.splice(1);
    const lastWord = allWords.slice(-1)[0];

    let activeCommand: Command = parent ?? command;
    let activeCommandIdx;
    let excludableFlags: string[] | undefined = undefined;

    for (let i = 0; i < allWords.length; i++) {
        const subCommand = activeCommand.getVisibleCommands().find(cmd => cmd.name() === allWords[i]);
        if (subCommand) {
            activeCommand = subCommand;
            activeCommandIdx = i;
        }
    }

    if (activeCommandIdx !== undefined)
        excludableFlags = allWords.slice(activeCommandIdx + 1);

    const autoCompleteWords = [
        ...await activeCommand.complete?.({ lastWord, allWords }) ?? [],
        ...activeCommand.getVisibleCommands().map(subCommand => subCommand.name()),
        ...activeCommand.getFlags(excludableFlags),
    ];


    let filteredAutocompleteWords: string[] = [];

    if (!lastWord || activeCommand.name() === lastWord)
        filteredAutocompleteWords = autoCompleteWords;
    else
        filteredAutocompleteWords = autoCompleteWords.filter(completeWord => completeWord.startsWith(lastWord) && completeWord !== lastWord);

    if (filteredAutocompleteWords.length === 0) return;

    // Sort the autocomplete words so that flags come after commands
    return filteredAutocompleteWords;
}