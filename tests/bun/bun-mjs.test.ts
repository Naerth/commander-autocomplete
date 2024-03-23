import { expect, test } from 'bun:test';
import { join } from 'path';

const program = join(import.meta.dir, "..", "fixtures", "example-program.ts");
const asyncProgram = join(import.meta.dir, "..", "fixtures", "example-program.ts");
const testHomeDirectory = join(import.meta.dir, "..", "fixtures", "test-home-dir");
const testNodeDirectory = join(import.meta.dir, "..", "fixtures", "test-node-dir");

test("bun | autocomplete top level command", async () => {
    const { stdout } = Bun.spawnSync({
        cmd: ["bun", program, "completion", "example"],
        stdout: 'pipe',
    })
    expect(stdout.toString()).toBe("git ls lsSync\n");
});

test("bun | autocomplete subcommand", async () => {
    const { stdout } = Bun.spawnSync({
        cmd: ["bun", program, "completion", "example", "git"],
        stdout: 'pipe',
    })
    expect(stdout.toString()).toBe("clone commit push\n");
});

test("bun | autocomplete sync handler", async () => {
    const { stdout } = Bun.spawnSync({
        cmd: ["bun", program, "completion", "example", "lsSync"],
        cwd: testNodeDirectory,
        stdout: 'pipe',
    })
    expect(stdout.toString()).toBe("--human-readable --reverse -h -r dist package.json src yarn.lock\n");
});

test("bun | autocomplete async handler", async () => {
    const { stdout } = Bun.spawnSync({
        cmd: ["bun", program, "completion", "example", "ls"],
        cwd: testHomeDirectory,
        stdout: 'pipe',
    })
    expect(stdout.toString()).toBe("--all --long -a -l .bashrc .ssh\n");
});

test("bun | autocomplete async parser", async () => {
    const { stdout } = Bun.spawnSync({
        cmd: ["bun", asyncProgram, "completion", "example", "ls"],
        cwd: testHomeDirectory,
        stdout: 'pipe',
    })
    expect(stdout.toString()).toBe("--all --long -a -l .bashrc .ssh\n");
});