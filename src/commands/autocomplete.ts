import { Command } from "./command.js";
import { getActiveCommand } from './get-active-command.js';
import { getActiveOption } from './get-active-option.js';
import { getAvailableCommandAvailableSuggestions } from './get-available-suggestions.js';
import { getSuggestions } from './get-suggestions.js';

/**
 * Provides autocomplete for command-line interfaces built with the Commander.js library.
 * @param commanderArgs - The arguments passed to the autocomplete function.
 * @returns A promise that resolves to an array of strings to be used for autocomplete.
 */
export async function autocomplete(...commanderArgs: any[]): Promise<string[] | undefined> {
    const command = commanderArgs.pop() as Command;
    const { parent, args } = command;

    const inputWords = args.slice(1); // skip binary
    const lastWord = inputWords.at(-1) ?? '';
    const lastRealWord = inputWords.filter(Boolean).at(-1) ?? '';

    /**
     * Get the active command based on the input words.
     */
    const { activeCommand, activeCommandIdx } = getActiveCommand(inputWords, parent ?? command, 0);

    /**
     * Get the active option
     */
    const activeOption = getActiveOption(inputWords, activeCommand);

    /**
     * Get the remaining words after the active command.
     * This is used to determine which options and arguments choices have already been used.
     * The active command is the command that is currently being processed,
     * and the remaining words are those that come after it in the input.
     */
    const remainingWords = inputWords.slice(activeCommandIdx + 1);

    /**
     * Get excludables words
     * This includes options and arguments choices that have already been used
     * after the active command.
     */
    const availableSuggestions = getAvailableCommandAvailableSuggestions(remainingWords, activeCommand);

    /**
     * Get suggestions based on the active command and option.
     */
    const suggestions = await getSuggestions(
        activeCommand,
        activeOption,
        availableSuggestions,
        inputWords,
        lastWord,
        lastRealWord
    )
    
    /**
     * Filter suggestions based on the last word.
     * If the last word is empty or matches the active command name, return all suggestions.
     * Otherwise, filter suggestions that start with the last word and are not equal to the last word.
     */
    const filtered = (!lastWord || activeCommand.name() === lastWord)
        ? suggestions
        : suggestions.filter(word => word.startsWith(lastWord) && word !== lastWord);

    /**
     * Return the filtered suggestions if any exist, otherwise return undefined.
     * Returning undefined allow the shell to handle the case where no suggestions are available,
     * Basically, shell will display folders and files in the current directory.
     * which is useful for the command line interface to handle gracefully.
     */
    return filtered.length > 0 ? filtered.toSorted() : undefined;
}