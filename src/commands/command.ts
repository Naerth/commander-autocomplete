/**
 * Extend Command class from Commander
 * Add onAutocomplete option
 */
import { AutocompletionHandler, CommandOptions, Command as CommanderCommand, ExecutableCommandOptions, ParseOptions } from "commander";
import { useAutocompletion } from ".";

export class Command extends CommanderCommand {

    /**
     * The autocompletion handler function for the command.
     */
    autocompleteHandler: AutocompletionHandler;

    /**
     * Sets the autocompletion handler function for the command.
     * @param autocompleteHandler - The autocompletion handler function.
     * @returns The `Command` object to allow for method chaining.
     * 
     * @example
     *  program
     *      .command("git")
     *      .autocompletion(() => ["--help", "--version", "clone", "commit", "push"]);
     */
    public autocompletion(autocompleteHandler: AutocompletionHandler): Command {
        this.autocompleteHandler = autocompleteHandler;
        return this;
    }

    /**
    * Returns a promise that resolves to an array of strings to be used for autocompletion.
    * @returns A promise that resolves to an array of strings to be used for autocompletion.
    */
    public async autocomplete() {
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
     * Unable autocompletion
     */
    public parse(argv?: readonly string[] | undefined, options?: ParseOptions | undefined): this {
        useAutocompletion(this);
        return super.parse(argv, options);
    }

}