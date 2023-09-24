import fs from 'fs';
import { join } from 'path';


const main = () => {

    const distDir = join(import.meta.dir, "..", "dist");
    const cjsDir = join(distDir, "cjs");

    if (!fs.existsSync(cjsDir)) {
        console.error("Must build first");
        return;
    }

    const packageJsonFile = join(cjsDir, "package.json");

    if (!fs.existsSync(packageJsonFile)) {

        console.log(`write ${packageJsonFile}`)
        fs.writeFileSync(packageJsonFile, JSON.stringify({ module: 'commonjs' }));

        return;
    }

    console.log(`${packageJsonFile} already exists`)
}

main();