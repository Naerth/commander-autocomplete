/**
 * Extend Command class from Commander
 * Add onAutocomplete option
 */
import { Command as CommanderCommand, Option, ParseOptions } from "commander";
import { AutocompleteHandler, AutocompleteHandlerProps } from "../types.js";
import { cleanUpBash } from '../utils/cleanup.js';
import { setupBash } from '../utils/setup.js';
import { autocomplete } from './autocomplete.js';

const setupOption = new Option("--setup", "setup completion mode");
const cleanupOption = new Option("--cleanup", "cleanup completion mode");
setupOption.hidden = true;
cleanupOption.hidden = true;


export class Command extends CommanderCommand {
    /**
     * @override
     */
    public parent: Command | null = null;

    /**
     * @override
     */
    public commands: Command[] = [];

    /**
     * @override
     */
    private _hidden: boolean = false;

    /**
     * The autocomplete handler function for the command.
     * @internal
     */
    private autocompleteHandler?: AutocompleteHandler;

    /**
     * Gets the hidden status of the command.
     * @returns {boolean} The hidden status of the command.
     */
    public hidden() {
        return this._hidden;
    }

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
        this.autocompleteHandler = autocompleteHandler;
        return this;
    }

    /**
    * Returns a promise that resolves to an array of strings to be used for autocomplete.
    * @returns A promise that resolves to an array of strings to be used for autocomplete.
    */
    public async complete(props: AutocompleteHandlerProps) {
        return await this.autocompleteHandler?.(props) ?? [];
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
        this.enableAutocomplete(argv, options);
        return super.parse(argv, options);
    }

    /**
     * @override Enable autocomplete 
     */
    public async parseAsync(argv?: readonly string[] | undefined, options?: ParseOptions | undefined): Promise<this> {
        this.enableAutocomplete(argv, options);
        return super.parseAsync(argv, options);
    }

    /**
     * Sets up the autocomplete for the program.
     * @internal
     * @throws {Error} Throws an error if the name is not provided.
     */
    private setup() {
        setupBash(this.name());
        process.exit(0);
    }

    /**
     * Cleans up the autocomplete for the program.
     * @internal
     * @throws {Error} Throws an error if the name is not provided.
     */
    private cleanup() {
        if (!this.name())
            throw new Error("Command name is required to enable autocomplete");
        cleanUpBash(this.name());
        process.exit(0);
    }

    /**
     * Enables autocomplete functionality for the program.
     * @internal
     */
    private enableAutocomplete(argv?: readonly string[] | undefined, options?: ParseOptions | undefined) {

        this.addOption(setupOption);
        this.addOption(cleanupOption);

        const userArgs = super._prepareUserArgs(argv, options);

        if (userArgs.includes(`--${setupOption.name()}`))
            this.setup();


        if (userArgs.includes(`--${cleanupOption.name()}`))
            this.cleanup();


        this
            .command("completion", { hidden: true })
            .allowUnknownOption(true)
            .allowExcessArguments(true)
            .action(async (...args: any[]) => {
                const words = await autocomplete(...args);
                if (words) console.log(words.join(" "));
            });
    }
}
