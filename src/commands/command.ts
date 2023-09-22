/**
 * Extend Command class from Commander
 * Add onAutocomplete option
 */
import { AutocompletionHandler, CommandOptions, Command as CommanderCommand, ExecutableCommandOptions } from "commander";

export class Command extends CommanderCommand {

    autocompleteHandler: AutocompletionHandler;
    private hidden?: boolean;


    public autocompletion(autocompleteHandler: AutocompletionHandler) {
        this.autocompleteHandler = autocompleteHandler;
        return this;
    }

    public isHidden() {
        return !!this.hidden;
    }

    public autocomplete() {
        return this.autocompleteHandler?.() ?? [];
    }

    createCommand(name: string): Command {
        return new Command(name);
    }
}