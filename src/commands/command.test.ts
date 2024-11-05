import { Command as CommanderCommand } from 'commander';
import * as setup from '../utils/setup.js';
import * as cleanup from '../utils/cleanup.js';
import { Command } from './command';

describe('Command', () => {
    let command: Command;

    beforeEach(() => {
        command = new Command('git');
        command.option('-f, --force');

        command
            .command('clone')
            .description('Clone a repository')
            .option('--mirror');

        command
            .command('pull')
            .description('Pull from a repository')
            .option('-q, --quiet');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should set the autocomplete handler function for the command', () => {
        const autocompleteHandler = () => ['test'];
        command.autocomplete(autocompleteHandler);
        expect(command.complete).toBeDefined();
    });

    it('should return an array of visible commands', () => {
        const visibleCommands = command.getVisibleCommands();
        expect(visibleCommands.map(cmd => cmd.name())).toEqual(['clone', 'pull']);
    });

    it('should return an array of flags', () => {
        const flags = command.getFlags();
        expect(flags).toEqual(['--force', '-f']);
    });

    it('should create a new command', () => {
        const newCommand = command.createCommand('new');
        expect(newCommand).toBeInstanceOf(Command);
    });

    it('should add setup and cleanup option', () => {

        jest.spyOn(CommanderCommand.prototype, 'parse').mockReturnValue(command);
        command.parse();

        const optionsFlags = command.options.map(option => option.name());
        expect(optionsFlags).toEqual(['force', 'setup', 'cleanup']);
    });

    it('async - should add setup and cleanup option', async () => {

        jest.spyOn(CommanderCommand.prototype, 'parseAsync').mockResolvedValue(command);
        await command.parseAsync();
        const optionsFlags = command.options.map(option => option.name());
        expect(optionsFlags).toEqual(['force', 'setup', 'cleanup']);
    });

    it('Should call setupBash', () => {
        jest.spyOn(CommanderCommand.prototype, 'parse').mockReturnValue(command);
        jest.spyOn(process, 'exit').mockImplementation(() => { return 0 as never; });
        const mockedSetupBash = jest.spyOn(setup, 'setupBash').mockImplementation(() => { });

        const localCommand = new Command();
        localCommand.parse(['--setup'], { from: 'user' });
        expect(mockedSetupBash).toBeCalledTimes(1);

        mockedSetupBash.mockClear();
    });

    it('Should call cleanupBash', () => {
        jest.spyOn(CommanderCommand.prototype, 'parse').mockReturnValue(command);
        jest.spyOn(process, 'exit').mockImplementation(() => { return 0 as never; });
        const mockCleanUp = jest.spyOn(cleanup, 'cleanUpBash').mockImplementation(() => { });

        const localCommand = new Command();
        localCommand.parse(['--cleanup'], { from: 'user' });
        expect(mockCleanUp).toHaveBeenCalledTimes(1);

        mockCleanUp.mockClear();
    });

});