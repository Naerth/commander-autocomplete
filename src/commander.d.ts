import 'commander';
import { AutocompleteHandler, AutocompleteHandlerProps } from './types';

declare module "commander" {
    export interface Command {
        autocomplete(handler: AutocompleteHandler): Command;
        complete(props: AutocompleteHandlerProps): Promise<string[]>;
        parent: Command | null;
        private _executableFile?: string;
        private _hidden?: boolean;
    }
}