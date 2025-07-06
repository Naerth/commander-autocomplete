import { getSuggestions } from './get-suggestions';

describe('getSuggestions', () => {
   
    const mockCommand = (completeReturn?: string[] | Promise<string[]>) => ({
        complete: completeReturn
            ? jest.fn().mockImplementation(() => Promise.resolve(completeReturn))
            : undefined
    }) as any;

    it('returns argChoices if lastRealWord is not included in argChoices', async () => {
        const option = { argChoices: ['foo', 'bar'], includes: () => false } as any;
        const result = await getSuggestions(
            {} as any,
            option,
            ['baz'],
            ['some', 'input'],
            'input',
            'not-in-choices'
        );
        expect(result).toEqual(['foo', 'bar']);
    });

    it('returns completions and availableSuggestions if argChoices is empty', async () => {
        const command = mockCommand(['abc', 'def']);
        const result = await getSuggestions(
            command,
            undefined,
            ['suggest1', 'suggest2'],
            ['word1', 'word2'],
            'word2',
            'word2'
        );
        expect(result).toEqual(['abc', 'def', 'suggest1', 'suggest2']);
    });

    it('returns completions and availableSuggestions if lastRealWord is in argChoices', async () => {
        const option = { argChoices: ['foo', 'bar'], includes: (val: string) => val === 'foo' } as any;
        const command = mockCommand(['completion1']);
        const result = await getSuggestions(
            command,
            option,
            ['suggestion'],
            ['foo'],
            'foo',
            'foo'
        );
        expect(result).toEqual(['completion1', 'suggestion']);
    });

    it('returns only availableSuggestions if no complete method', async () => {
        const result = await getSuggestions(
            {} as any,
            undefined,
            ['onlySuggestion'],
            [],
            '',
            ''
        );
        expect(result).toEqual(['onlySuggestion']);
    });

    it('returns empty array if no completions and no availableSuggestions', async () => {
        const command = mockCommand([]);
        const result = await getSuggestions(
            command,
            undefined,
            [],
            [],
            '',
            ''
        );
        expect(result).toEqual([]);
    });

    it('handles undefined argChoices gracefully', async () => {
        const option = { argChoices: undefined } as any;
        const command = mockCommand(['x']);
        const result = await getSuggestions(
            command,
            option,
            ['y'],
            [],
            '',
            ''
        );
        expect(result).toEqual(['x', 'y']);
    });

    it('handles missing complete method gracefully', async () => {
        const option = { argChoices: undefined } as any;
        const result = await getSuggestions(
            {} as any,
            option,
            ['a'],
            [],
            '',
            ''
        );
        expect(result).toEqual(['a']);
    });
});