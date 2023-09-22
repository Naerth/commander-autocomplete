# commander-autocompletion

commander-autocompletion is a Node.js module that provides autocompletion for command-line interfaces built with the [Commander.js](https://github.com/tj/commander.js) library.

## Installation
You can install commander-autocompletion using npm, yarn, or bun:

```
npm install @naerth/commander-autocompletion
```

```
yarn add @naerth/commander-autocompletion
```

```
bun install @naerth/commander-autocompletion
```
## Usage
To use commander-autocompletion, you need to add the following code to your Commander.js-based CLI application:

Autocompletion with subcommands

```javascript
import { program, useAutocompletion } from "@naerth/commander-autocompletion";

program.name("example");

const hello = program
.command("hello")
.action(() => {
  console.log("Hello");
});

hello.command("world").action(() => {
  console.log("Hello, world!");
});

// automatically enable autocompletion
program.parse()

```

Programmatic autocompletion

```javascript
import { program, useAutocompletion } from "@naerth/commander-autocompletion";

program.name("example");

program
.command("list")
.autocompletion(async () => ["world", "universe"]) // programmatic autocompletion
.action(() => {
  console.log("Hello, world!");
});


// automatically enable autocompletion
program.parse()
```
Both autocompletion can be used together.

## Autocompletion in a terminal

To use autocompletion in a terminal:

```bash
example --setup
```

To disable autocompletion:

```bash
example --cleanup
```
## Limitation
Currently, commander-autocompletion only supports autocompletion for commands.
Autocompletion for options is not supported yet.

Only Bash is supported at the moment.

## Contributing
If you would like to contribute to commander-autocompletion, please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
