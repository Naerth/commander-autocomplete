import { expect, test } from 'bun:test';
import { join } from 'path';

const program = join(__dirname, "..", "fixtures", "example-program.ts");
const testHomeDirectory = join(__dirname, "..", "fixtures", "test-home-dir");
const testNodeDirectory = join(__dirname, "..", "fixtures", "test-node-dir");

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
    expect(stdout.toString()).toBe("dist package.json src yarn.lock\n");
});

test("bun | autocomplete async handler", async () => {
    const { stdout } = Bun.spawnSync({
        cmd: ["bun", program, "completion", "example", "ls"],
        cwd: testHomeDirectory,
        stdout: 'pipe',
    })
    expect(stdout.toString()).toBe(".bashrc .ssh\n");
});