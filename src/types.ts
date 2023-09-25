export type AutocompleteHandlerProps = {
    /**
     * The last word of the command being typed.
     */
    lastWord: string;
    
    /**
     * All words of the command being typed.
     */
    allWords: string[];
};

/**
 * Autocomplete handler
 * @params props @see {@link AutocompleteHandlerProps}
 */
export type AutocompleteHandler = (props: AutocompleteHandlerProps) => string[] | Promise<string[]>;