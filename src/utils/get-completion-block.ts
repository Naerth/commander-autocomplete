import os from 'os';

export default function getCompletionBlock(completionFile: string) {
    return `source ${completionFile.replace(os.homedir(), "~")}\n`
}