# @naerth/commander-autocomplete

commander-autocomplete is a module that provides autocomplete for command-line interfaces built with the [Commander.js](https://github.com/tj/commander.js) library.

![npm](https://img.shields.io/npm/v/@naerth/commander-autocomplete) <!-- coverage-badge-start -->
![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
<!-- coverage-badge-end -->

## Installation
You can install commander-autocomplete using npm, yarn, or bun:

```bash
npm install commander @naerth/commander-autocomplete
```

```bash
yarn add commander @naerth/commander-autocomplete
```

```bash
bun install commander @naerth/commander-autocomplete
```

## Usage
To use commander-autocomplete, you need to add the following code to your Commander.js-based CLI application.

commander-autocomplete supports both Javascript and TypeScript.

### Autocomplete with subcommands

#### typescript

```typescript

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
program.parse(process.argv);

```
Terminal 

```bash
$ example hello<TAB>
world
```

### Autocomplete with options

```typescript

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
program.parse(process.argv);

```
Terminal 

```bash
$ example hello<TAB>
-d       --debug  world
```

### Autocomplete with arguments and options choices

> **Note:** `Argument` and `Option` should be imported from `commander`, not from `@naerth/commander-autocomplete`.

```typescript
const { program } = require("@naerth/commander-autocomplete");
// or
import { program } from "@naerth/commander-autocomplete";
import { Argument, Option } from 'commander';

const argument = new Argument('<repository>', 'Repository to clone')
argument.choices(['repo1', 'repo2', 'repo3'])

const typeOption = new Option('--type <type>', 'Type of clone');
typeOption.choices(['full', 'shallow']);

program
    .command('clone')
    .addArgument(argument)
    .addOption(typeOption)
    .action(() => {
        console.log('clone command executed');
    });


program.parse(process.argv);

```
Terminal 

```bash
$ example clone repo<TAB>
repo1  repo2  repo3
```

```bash
$ example clone repo2 --type <TAB>
full     shallow
```

### Autocomplete with dynamic suggestions

You can provide dynamic autocomplete suggestions for a command by using the `.autocomplete` method, which accepts a function (sync or async) that returns an array of possible completions.

```typescript

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
program.parse(process.argv)
```

Terminal 

```bash
$ example ls<TAB>
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

## Limitations

Currently, only Bash is supported. Support for other shells (such as Zsh or Fish) is not yet available, but contributions to add support for additional shells are welcome—please see the Contributing section if you would like to help.


## Contributing
If you would like to contribute to commander-autocomplete, please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
