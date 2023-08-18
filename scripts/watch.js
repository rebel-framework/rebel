const fs = require('fs').promises;
const { spawn } = require('child_process');
const path = require('path');

async function runWatchScriptForPackage(packageDir) {
  try {
    const packageJsonPath = path.join(packageDir, 'package.json');
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    if (packageJson.scripts && packageJson.scripts.watch) {
      const watchCommand = packageJson.scripts.watch.split(' ');
      const cmd = watchCommand.shift();
      const args = watchCommand;

      const child = spawn(cmd, args, {
        cwd: packageDir,
        stdio: 'inherit', // This ensures that the output is displayed in the console.
        shell: true,
      });

      child.on('error', (error) => {
        console.error(
          `Error spawning process for package: ${packageDir}`,
          error
        );
      });
    }
  } catch (error) {
    console.error(`Error processing package: ${packageDir}`, error);
  }
}

async function main() {
  const packagesDir = path.resolve(__dirname, '../packages');
  const directories = await fs.readdir(packagesDir, { withFileTypes: true });

  for (const dir of directories) {
    if (dir.isDirectory()) {
      await runWatchScriptForPackage(path.join(packagesDir, dir.name));
    }
  }
}

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
