import 'commander';

declare module "commander" {

    export interface Command {
        public _hidden?: boolean;
        onAutocomplete?: () => string[];
    }

    export interface CommandOptions {
        onAutocomplete?: () => string[];
    }

    export interface ExecutableCommandOptions {
        onAutocomplete?: () => string[];
    }
}