import 'commander';

declare module "commander" {

    export type autocompleteHandler = (() => string[]) | (() => Promise<string[]>) | undefined;
    export interface Command {
        readonly autocompleteHandler: autocompleteHandler;
        autocomplete(handler: autocompleteHandler): Command;
        complete(): Promise<string[]>;
        parent: Command | null;
        private _executableFile?: string;
        private _hidden?: boolean;
        enableautocomplete(): void;
    }
}