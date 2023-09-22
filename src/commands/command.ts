/**
 * Extend Command class from Commander
 * Add onAutocomplete option
 */
import { CommandOptions, Command as CommanderCommand, ExecutableCommandOptions } from "commander";

export class Command extends CommanderCommand {

    command(nameAndArgs: string, opts?: CommandOptions | undefined): ReturnType<this["createCommand"]>;
    command(nameAndArgs: string, description: string, opts?: ExecutableCommandOptions | undefined): this;
    command(nameAndArgs: string, description?: string | CommandOptions, opts?: ExecutableCommandOptions): this | ReturnType<this["createCommand"]> {

        if (typeof description === "string") {
            const cmd = super.command(nameAndArgs, description, opts);
            cmd.onAutocomplete = opts?.onAutocomplete
            return cmd;
        }
        else {
            const cmd = super.command(nameAndArgs, description);
            cmd.onAutocomplete = description?.onAutocomplete
            return cmd;
        }
    }
}