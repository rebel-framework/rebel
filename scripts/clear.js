const fsSync = require('fs');
const fs = require('fs').promises;
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

async function deleteTgzFiles() {
  const files = await fs.readdir(rootDir);
  for (const file of files) {
    if (file.endsWith('.tgz')) {
      const filePath = path.join(rootDir, file);
      console.log(`Deleting ${filePath}...`);
      await fs.unlink(filePath);
    }
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
  await deleteTgzFiles();
  console.log('Clearing process completed.');
}

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
