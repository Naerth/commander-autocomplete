/**
 * Extend Command class from Commander
 * Add onAutocomplete option
 */
import { Command as CommanderCommand, ParseOptions } from "commander";
import { AutocompleteHandler, AutocompleteHandlerProps } from "../types.js";
import { enableAutocomplete } from "./enableAutocomplete.js";

export class Command extends CommanderCommand {

    /**
     * The autocomplete handler function for the command.
     */
    private _autocompleteHandler?: AutocompleteHandler;

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
    public autocomplete(autocompleteHandler: AutocompleteHandler): Command {
        this._autocompleteHandler = autocompleteHandler;
        return this;
    }

    /**
    * Returns a promise that resolves to an array of strings to be used for autocomplete.
    * @returns A promise that resolves to an array of strings to be used for autocomplete.
    */
    public async complete(props: AutocompleteHandlerProps) {
        return await this._autocompleteHandler?.(props) ?? [];
    }

    /**
     * @override
     */
    public createCommand(name: string): Command {
        return new Command(name);
    }

    /**
    * @override Enable autocomplete
    */
    public parse(argv?: readonly string[] | undefined, options?: ParseOptions | undefined): this {
        enableAutocomplete(this);
        return super.parse(argv, options);
    }

    /**
     * @override Enable autocomplete 
     */
    public parseAsync(argv?: readonly string[] | undefined, options?: ParseOptions | undefined): Promise<this> {
        enableAutocomplete(this);
        return super.parseAsync(argv, options);
    }

}