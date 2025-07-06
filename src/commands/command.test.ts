import { jest } from '@jest/globals';
import { Command } from './command.js';
import { setupBash } from '../utils/setup.js';
import { cleanUpBash } from '../utils/cleanup.js';
import type { AutocompleteHandler } from '../types.js';
import { Command as CommanderCommand } from 'commander';
import * as autocompleteModule from './autocomplete.js';

jest.mock('../../src/utils/setup');
jest.mock('../../src/utils/cleanup');

describe('Command', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should set autocomplete handler and call it in complete()', async () => {
        const cmd = new Command('test');

        const handler = jest.fn<AutocompleteHandler>(() => (['foo', 'bar']));
        cmd.autocomplete(handler);

        const result = await cmd.complete({ allWords: [], lastWord: '' });
        expect(result).toEqual(['foo', 'bar']);
        expect(handler).toHaveBeenCalledWith({ allWords: [], lastWord: '' });
    });

    test('should return empty array if no autocomplete handler set', async () => {
        const cmd = new Command('test');
        const result = await cmd.complete({ allWords: [], lastWord: '' });
        expect(result).toEqual([]);
    });

    test('should create new sub-command as extended Command', () => {
        const root = new Command('root');
        const sub = root.createCommand('sub');
        expect(sub).toBeInstanceOf(Command);
    });

    test('should add hidden setup/cleanup options and call setupBash on --setup', () => {
        const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
            throw new Error('process.exit called');
        });

        const cmd = new Command('foo');
        expect(() => {
            cmd.parse(['node', 'foo', '--setup']);
        }).toThrow('process.exit called');

        expect(setupBash).toHaveBeenCalledWith('foo');
        mockExit.mockRestore();
    });

    test('should call cleanUpBash on --cleanup', () => {
        const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
            throw new Error('process.exit called');
        });

        const cmd = new Command('foo');
        expect(() => {
            cmd.parse(['node', 'foo', '--cleanup']);
        }).toThrow('process.exit called');

        expect(cleanUpBash).toHaveBeenCalledWith('foo');
        mockExit.mockRestore();
    });

    test('should throw error if cleanup is called with no name', () => {
        const cmd = new Command(); // No name provided
        const cleanupFn = () => (cmd as any).cleanup(); // Force call to private method

        expect(cleanupFn).toThrow('Command name is required to enable autocomplete');
    });

    test('parseAsync should call enableAutocomplete and then parseAsync', async () => {
        const cmd = new Command('foo');
        const spy = jest.spyOn(Command.prototype as any, 'enableAutocomplete');

        jest.spyOn(process, 'exit').mockImplementation(() => (null as never));
        jest
            .spyOn(CommanderCommand.prototype, 'parseAsync')
            .mockImplementation(async () => cmd); // Mock parseAsync to return this command

        const result = await cmd.parseAsync(['node', 'foo']);
        expect(result).toBe(cmd);
        expect(spy).toHaveBeenCalled();
    });

    test('parse should call enableAutocomplete and then parse', async () => {
        const cmd = new Command('foo');
        const spy = jest.spyOn(Command.prototype as any, 'enableAutocomplete');

        jest.spyOn(process, 'exit').mockImplementation(() => (null as never));
        jest
            .spyOn(CommanderCommand.prototype, 'parse')
            .mockImplementation(() => cmd); // Mock parseAsync to return this command

        const result = await cmd.parse(['node', 'foo']);
        expect(result).toBe(cmd);
        expect(spy).toHaveBeenCalled();
    });
});
