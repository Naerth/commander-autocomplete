/**
 * Extend Command class from Commander
 * Add onAutocomplete option
 */
import { autocompleteHandler, CommandOptions, Command as CommanderCommand, ExecutableCommandOptions, ParseOptions } from "commander";
import { useAutocomplete } from "./useAutocomplete.js";

export class Command extends CommanderCommand {

    /**
     * The autocomplete handler function for the command.
     */
    autocompleteHandler: autocompleteHandler;

    /**
     * Sets the autocomplete handler function for the command.
     * @param autocompleteHandler - The autocomplete handler function.
     * @returns The `Command` object to allow for method chaining.
     * 
     * @example
     *  program
     *      .command("git")
     *      .autocomplete(() => ["--help", "--version", "clone", "commit", "push"]);
     */
    public autocomplete(autocompleteHandler: autocompleteHandler): Command {
        this.autocompleteHandler = autocompleteHandler;
        return this;
    }

    /**
    * Returns a promise that resolves to an array of strings to be used for autocomplete.
    * @returns A promise that resolves to an array of strings to be used for autocomplete.
    */
    public async complete() {
        return await this.autocompleteHandler?.() ?? [];
    }

    /**
     * @override
     */
    public createCommand(name: string): Command {
        return new Command(name);
    }

     /**
     * @override
     * Unable autocomplete
     */
    public parse(argv?: readonly string[] | undefined, options?: ParseOptions | undefined): this {
        useAutocomplete(this);
        return super.parse(argv, options);
    }

}