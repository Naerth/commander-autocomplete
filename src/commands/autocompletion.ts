import { Command } from "./command";

const getVisibleCommands = (command: Command) => command.commands.filter(cmd => !cmd._hidden)

export function autocompletion(..._args: any[]) {

    const { parent, args } = (_args.pop() as Command);

    const wPrevious = [...args.splice(1)];
    const lastWord = wPrevious.slice(-1)[0];


    if (!parent)
        return;

    let activeCommand: Command = parent;

    for (let i = 0; i < wPrevious.length; i++) {

        const subLeaf = getVisibleCommands(activeCommand).find(cmd => cmd.name() === wPrevious[i]);
        if (subLeaf)
            activeCommand = subLeaf;

    }

    const autoCompleteWords = [
        ...getVisibleCommands(activeCommand).map(leaf => leaf.name()),
        ...activeCommand.onAutocomplete?.() ?? []
    ];

    if (autoCompleteWords.length > 0) {
        if (
            wPrevious.length === 0
            || activeCommand.name() === lastWord
            || autoCompleteWords.some(cmd => cmd.includes(lastWord) && cmd !== lastWord)
        )
            return console.log(autoCompleteWords.join(" "))
    }
}