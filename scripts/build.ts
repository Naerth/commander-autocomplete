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
        external: ['commander'],
        minify: true,
        sourcemap: 'linked',
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