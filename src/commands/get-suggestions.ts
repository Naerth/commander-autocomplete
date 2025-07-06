import type { Option } from 'commander';
import type { Command } from './command.js';

export const getSuggestions = async (
    activeCommand: Command,
    activeOption: Option | undefined,
    availableSuggestions: string[],
    inputWords: string[],
    lastWord: string,
    lastRealWord: string,
) => {

    const suggestions: string[] = [];

    if (activeOption?.argChoices?.length && !activeOption.argChoices.includes(lastRealWord)) {
        suggestions.push(...activeOption.argChoices);
    } else {
        const completions = await activeCommand.complete?.({ lastWord, allWords: inputWords }) ?? [];
        suggestions.push(
            ...completions,
            ...availableSuggestions
        );
    }

    return suggestions;
};