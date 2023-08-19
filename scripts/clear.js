const fsSync = require('fs'); // For synchronous operations
const fs = require('fs').promises; // For promise-based operations
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');
const foldersToDelete = ['node_modules', 'build', 'coverage'];

async function deleteFolderRecursive(directory) {
  if (fsSync.existsSync(directory)) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const curPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await deleteFolderRecursive(curPath);
      } else {
        await fs.unlink(curPath);
      }
    }
    await fs.rmdir(directory);
  }
}

async function clearFolder(folderName) {
  if (folderName === 'node_modules') {
    const rootFolder = path.join(rootDir, folderName);
    console.log(`Deleting ${rootFolder}...`);
    await deleteFolderRecursive(rootFolder);
  }

  const directories = await fs.readdir(packagesDir, { withFileTypes: true });
  for (const dir of directories) {
    if (dir.isDirectory()) {
      const targetFolder = path.join(packagesDir, dir.name, folderName);
      if (fsSync.existsSync(targetFolder)) {
        console.log(`Deleting ${targetFolder}...`);
        await deleteFolderRecursive(targetFolder);
      }
    }
  }
}

async function main() {
  for (const folderName of foldersToDelete) {
    await clearFolder(folderName);
  }
  console.log('Clearing process completed.');
}

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
