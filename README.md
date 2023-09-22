# commander-autocomplete

commander-autocomplete is a Node.js module that provides autocomplete for command-line interfaces built with the [Commander.js](https://github.com/tj/commander.js) library.

## Installation
You can install commander-autocomplete using npm, yarn, or bun:

```
npm install @naerth/commander-autocomplete
```

```
yarn add @naerth/commander-autocomplete
```

```
bun install @naerth/commander-autocomplete
```
## Usage
To use commander-autocomplete, you need to add the following code to your Commander.js-based CLI application:

### Autocomplete with subcommands

```javascript
import { program, useautocomplete } from "@naerth/commander-autocomplete";

program.name("example");

const hello = program
  .command("hello")
  .action(() => {
    console.log("Hello");
  });

hello.command("world").action(() => {
  console.log("Hello, world!");
});

// automatically enable autocomplete
program.parse()

```
Terminal 

```bash
example hello[tab]
world
```

### Programmatic autocomplete

```javascript
import { program, useautocomplete } from "@naerth/commander-autocomplete";

program.name("example");

program
  .command("list")
  .autocomplete(async () => ["world", "universe"]) // programmatic autocomplete
  .action(() => {
    console.log("Hello, world!");
  });


// automatically enable autocomplete
program.parse()
```

Terminal 

```bash
example list[tab]
world universe
```

Both autocomplete usage can be used together.

## Autocomplete in a terminal

To use autocomplete in a terminal:

```bash
example --setup
```

To disable autocomplete:

```bash
example --cleanup
```
## Limitation
Currently, commander-autocomplete only supports autocomplete for commands.
autocomplete for options is not supported yet.

Only Bash is supported at the moment.

## Contributing
If you would like to contribute to commander-autocomplete, please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
