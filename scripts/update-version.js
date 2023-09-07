const fs = require('fs');
const path = require('path');

const rootPath = path.resolve(__dirname, '../packages');
const tag = process.argv[2];

if (!tag) {
  console.error('Please provide a tag!');
  process.exit(1);
}

// Extract the version number from the tag using regex
const versionMatch = tag.match(/(?:v)?([\d+\.]+(?:-[\w+]+)?)/);
if (!versionMatch || versionMatch.length < 2) {
  console.error('Invalid tag format!');
  process.exit(1);
}

const newVersion = versionMatch[1];

function updatePackageVersion(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const filepath = path.join(directory, file);
    const stats = fs.statSync(filepath);

    if (stats.isDirectory()) {
      if (file === 'node_modules') {
        continue; // Skip node_modules directories
      }
      updatePackageVersion(filepath); // Recursively check directories
    } else if (path.basename(filepath) === 'package.json') {
      // Update package.json version field
      const packageData = require(filepath);
      packageData.version = newVersion;
      fs.writeFileSync(filepath, JSON.stringify(packageData, null, 2) + '\n');
    }
  }
}

function updateLockFile() {
  // Load the package-lock.json file
  const lockfilePath = path.resolve(__dirname, '../package-lock.json');
  const lockfileData = require(lockfilePath);

  console.log(lockfileData);

  // Check if the "packages" property exists
  if (lockfileData.packages) {
    for (const [key, value] of Object.entries(lockfileData.packages)) {
      if (key.startsWith('packages/')) {
        value.version = newVersion;
        // Update the resolved field as well if it exists
        if (value.resolved) {
          value.resolved = value.resolved.replace(
            /(\d+\.\d+\.\d+)(?=.tgz)/,
            newVersion
          );
        }
      }
    }
  }

  // Save the updated package-lock.json file
  fs.writeFileSync(lockfilePath, JSON.stringify(lockfileData, null, 2) + '\n');
}

updatePackageVersion(rootPath);
updateLockFile();
