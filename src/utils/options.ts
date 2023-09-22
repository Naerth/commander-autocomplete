import { Option } from "commander";

const setupOption = new Option("--setup", "setup completion mode");
const cleanupOption = new Option("--cleanup", "cleanup completion mode");

setupOption.hidden = true;
cleanupOption.hidden = true;

export { setupOption, cleanupOption };