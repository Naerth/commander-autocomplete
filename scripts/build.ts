import type { Target } from 'bun';
import fs from 'fs/promises';
import { join } from 'path';

const entrypoint = join(import.meta.dir, '../src/index.ts');

const buildProject = async (target: Target) => {
    const outDir = join(import.meta.dir, '../dist', target);

    console.log(`Clear dist/${target} directory`);

    await fs.rm(outDir, { recursive: true, force: true });

    const buildStatus = await Bun.build({
        entrypoints: [entrypoint],
        target: target,
        format: 'esm',
        naming: 'commander-autocomplete.js',
        outdir: outDir
    });

    if (buildStatus.success) {
        console.log(`Build for ${target} successful`);
    }
    else {
        console.error(`Build for ${target} failed`);
        buildStatus.logs.forEach(log => console.error(log));
    }
};


await buildProject('bun');
await buildProject('node');

const tsConfig = await fs.readFile(join(import.meta.dir, '../tsconfig.json'), 'utf-8');
let tsConfigJson = JSON.parse(tsConfig);

// remove include/exclude properties
tsConfigJson.include = ['./**/*'];
delete tsConfigJson.exclude;

await fs.writeFile(join(import.meta.dir, '../dist/tsconfig.json'), JSON.stringify(tsConfigJson, null, 2), 'utf-8');


const packageJson = await fs.readFile(join(import.meta.dir, '../package.json'), 'utf-8');
let packageJsonObj = JSON.parse(packageJson);

// remove devDependencies
delete packageJsonObj.devDependencies;
delete packageJsonObj.scripts;
delete packageJsonObj.dependencies;
delete packageJsonObj.peerDependencies;

await fs.writeFile(join(import.meta.dir, '../dist/package.json'), JSON.stringify(packageJsonObj, null, 2), 'utf-8');


export { };
