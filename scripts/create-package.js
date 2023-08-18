const fs = require('fs').promises;

async function createPackage(name) {
  const corePath = './packages/core';
  const newPackagePath = `./packages/${name}`;

  console.log(`Creating directory: ${newPackagePath}`);
  await fs.mkdir(newPackagePath, { recursive: true });

  console.log(`Reading package.json from: ${corePath}/package.json`);
  const packageJson = await fs.readFile(`${corePath}/package.json`, 'utf-8');
  const packageData = JSON.parse(packageJson);
  packageData.name = `@rebel-framework/${name}`;

  console.log(
    `Writing updated package.json to: ${newPackagePath}/package.json`
  );
  await fs.writeFile(
    `${newPackagePath}/package.json`,
    JSON.stringify(packageData, null, 2),
    'utf-8'
  );

  console.log(`Creating README.md at: ${newPackagePath}/README.md`);
  await fs.writeFile(`${newPackagePath}/README.md`, `# ${name}`, 'utf-8');

  console.log(
    `Copying tsconfig.json from: ${corePath}/tsconfig.json to ${newPackagePath}/tsconfig.json`
  );
  await fs.copyFile(
    `${corePath}/tsconfig.json`,
    `${newPackagePath}/tsconfig.json`
  );

  console.log(`Creating src directory at: ${newPackagePath}/src`);
  await fs.mkdir(`${newPackagePath}/src`);

  console.log(`Creating test directory at: ${newPackagePath}/test`);
  await fs.mkdir(`${newPackagePath}/test`);

  console.log('All operations completed successfully.');
}

// Check for name parameter and execute
if (process.argv.length < 3) {
  console.error('Please provide a name parameter');
  process.exit(1);
}

createPackage(process.argv[2]).catch((error) => {
  console.error(`An error occurred: ${error.message}`);
  process.exit(1);
});
