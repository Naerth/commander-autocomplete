const { join } = require('path');
const { execSync } = require('child_process');

const program = join(__dirname, "..", "fixtures", "example-program.cjs");
const testHomeDirectory = join(__dirname, "..", "fixtures", "test-home-dir");
const testNodeDirectory = join(__dirname, "..", "fixtures", "test-node-dir");

test("cjs | autocomplete top level command", async () => {
    const stdout = execSync(`node ${program} completion example`, { stdio: ["pipe"] })
    expect(stdout.toString()).toBe("git ls lsSync\n");
});

test("cjs | autocomplete subcommand", async () => {
    const stdout = execSync(`node ${program} completion example git`, { stdio: ["pipe"] })
    expect(stdout.toString()).toBe("clone commit push\n");
});

test("cjs | autocomplete sync handler", async () => {
    const stdout = execSync(`node ${program} completion example lsSync`, { cwd: testNodeDirectory, stdio: ["pipe"] });
    expect(stdout.toString()).toBe("dist package.json src yarn.lock\n");
});

test("cjs | autocomplete async handler", async () => {
    const stdout = execSync(`node ${program} completion example ls`, { cwd: testHomeDirectory, stdio: ["pipe"] });
    expect(stdout.toString()).toBe(".bashrc .ssh\n");
});