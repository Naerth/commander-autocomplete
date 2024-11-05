import 'commander';
import { AutocompleteHandler, AutocompleteHandlerProps } from './types';

declare module "commander" {
    export interface Command {
        private _prepareUserArgs: (argv?: readonly string[], parseOptions?: ParseOptions) => string[];
    }
}