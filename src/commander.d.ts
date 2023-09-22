import 'commander';

declare module "commander" {

    export type AutocompletionHandler = (() => string[]) | (() => Promise<string[]>) | undefined;
    export interface Command {
        readonly autocompleteHandler: AutocompletionHandler;
        autocompletion(handler: AutocompletionHandler): Command;
        autocomplete(): Promise<string[]>;
        parent: Command | null;
        private _executableFile?: string;
        private _hidden?: boolean;
        enableAutocompletion(): void;
    }
}