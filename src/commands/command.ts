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
     * Returns an array of visible commands.
     * A command is considered visible if it is not hidden.
     *
     * @returns An array of visible commands.
     */
    public getVisibleCommands() {
        const commands = this.commands.filter(cmd => !cmd.hidden());
        return commands.toSorted((a, b) => a.name().localeCompare(b.name()));
    }

    public getFlags(excludableFlags: string[] = []) {
        const visibleOptions = this.options.filter(opt => !opt.hidden);
        const flags = visibleOptions.reduce<string[]>((acc, option) => {
            const flags = option.flags.split(/[,\|\s]+/g).filter(Boolean);
            if (!flags.some(flag => excludableFlags.includes(flag)))
                acc.push(...flags);
            return acc;
        }, []);

        return flags.toSorted();
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
        this.enableAutocomplete();
        return super.parse(argv, options);
    }

    /**
     * @override Enable autocomplete 
     */
    public async parseAsync(argv?: readonly string[] | undefined, options?: ParseOptions | undefined): Promise<this> {
        this.enableAutocomplete();
        return super.parseAsync(argv, options);
    }

    /**
     * Sets up the autocomplete for the program.
     * @internal
     * @throws {Error} Throws an error if the name is not provided.
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
    private enableAutocomplete() {

        this.addOption(setupOption);
        this.addOption(cleanupOption);

        if (process.argv.includes(`--${setupOption.name()}`))
            this.setup();

        if (process.argv.includes(`--${cleanupOption.name()}`))
            this.cleanup();


        this
            .command("completion", { hidden: true })
            .allowUnknownOption(true)
            .action(async (...args: any[]) => {
                const words = await autocomplete(...args);
                if (words) console.log(words.join(" "));
            });
    }
}
