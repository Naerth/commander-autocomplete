# commander-autocomplete

commander-autocomplete is module that provides autocomplete for command-line interfaces built with the [Commander.js](https://github.com/tj/commander.js) library.

## Installation
You can install commander-autocomplete using npm, yarn, or bun:

```
npm install commander @naerth/commander-autocomplete
```

```
yarn add commander @naerth/commander-autocomplete
```

```
bun install commander @naerth/commander-autocomplete
```
## Usage
To use commander-autocomplete, you need to add the following code to your Commander.js-based CLI application:

### Autocomplete with subcommands

```javascript

const { program } = require("@naerth/commander-autocomplete");
// or
import { program } from "@naerth/commander-autocomplete";

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
$ example hello[tab]
world
```

### Autocomplete with options

```javascript

const { program } = require("@naerth/commander-autocomplete");
// or
import { program } from "@naerth/commander-autocomplete";

program.name("example");

const hello = program
  .command("hello")
  .option('-d, --debug')
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
$ example hello[tab]
-d       --debug  world
```

### Autocomplete with arguments and options choices

```javascript

const { program } = require("@naerth/commander-autocomplete");
// or
import { program } from "@naerth/commander-autocomplete";
import { Argument } from 'commander';

program.name("example");

const argument = new Argument('<repository>', 'Repository to clone')
argument.choices(['repo1', 'repo2', 'repo3'])

program
    .command('clone')
    .addArgument(argument)
    .action(() => {
        console.log('clone command executed');
    });


program.parse();

```
Terminal 

```bash
$ example clone repo[tab]
repo1  repo2  repo3
```

```bash
$ autocli clone repo2 --type
full     shallow
```

### Programmatic autocomplete

```javascript

const { program } = require("@naerth/commander-autocomplete");
// or
import { program } from "@naerth/commander-autocomplete";

program.name("example");

program
  .command("ls")
  .option("-l, --long", "long listing")
  .autocomplete(async () => ["world", "universe"]) // programmatic autocomplete
  .action(() => {
    console.log("Hello, world!");
  });


// automatically enable autocomplete
program.parse()
```

Terminal 

```bash
$ example list[tab]
-l        --long    universe  world 
```

## Autocomplete in a terminal

To use autocomplete in a terminal:

```bash
$ example --setup
source ~/.bashrc
```

To disable autocomplete:

```bash
$ example --cleanup
source ~/.bashrc
```
## Limitation

Only Bash is supported at the moment.

## Contributing
If you would like to contribute to commander-autocomplete, please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
