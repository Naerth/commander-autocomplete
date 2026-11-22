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

/**
 * Name of the hidden sub-command called by the shell to get suggestions.
 */
const COMPLETION_COMMAND = "completion";


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
     * Flag to track if autocomplete has been enabled.
     * @internal
     */
    private autocompleteEnabled: boolean = false;

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
        const completionArgs = this.enableAutocomplete(argv, options);
        if (completionArgs) return super.parse(completionArgs, { from: 'user' });
        return super.parse(argv, options);
    }

    /**
     * @override Enable autocomplete 
     */
    public async parseAsync(argv?: readonly string[] | undefined, options?: ParseOptions | undefined): Promise<this> {
        const completionArgs = this.enableAutocomplete(argv, options);
        if (completionArgs) return super.parseAsync(completionArgs, { from: 'user' });
        return super.parseAsync(argv, options);
    }

    /**
     * Sets up the autocomplete for the program.
     * @internal
     * @throws {Error} Throws an error if the name is not provided or invalid.
     */
    private setup() {
        if (!this.name())
            throw new Error("Command name is required to enable autocomplete");
        setupBash(this.name());
        process.exit(0);
    }

    /**
     * Cleans up the autocomplete for the program.
     * @internal
     * @throws {Error} Throws an error if the name is not provided or invalid.
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
     * @returns The arguments to parse when the shell asks for completions, otherwise undefined.
     *          The words of the command line being completed are placed after `--`,
     *          so they are never interpreted as options (`--help`, `--version`, `--setup`...).
     */
    private enableAutocomplete(argv?: readonly string[] | undefined, options?: ParseOptions | undefined): string[] | undefined {

        const userArgs = super._prepareUserArgs(argv, options);
        const isCompletion = userArgs[0] === COMPLETION_COMMAND;

        // Prevent duplicate initialization
        if (!this.autocompleteEnabled) {
            this.autocompleteEnabled = true;

            this.addOption(setupOption);
            this.addOption(cleanupOption);

            this
                .command(COMPLETION_COMMAND, { hidden: true })
                .helpOption(false)
                .allowUnknownOption(true)
                .allowExcessArguments(true)
                .action(async (...args: [...string[], Command]) => {
                    const words = await autocomplete(...args);
                    // One suggestion per line, so that suggestions can contain spaces
                    if (words) console.log(words.join("\n"));
                });
        }

        if (isCompletion) {
            const words = userArgs.slice(1);
            if (words[0] === '--') words.shift();
            return [COMPLETION_COMMAND, '--', ...words];
        }

        if (userArgs.includes(`--${setupOption.name()}`))
            this.setup();

        if (userArgs.includes(`--${cleanupOption.name()}`))
            this.cleanup();
    }
}
