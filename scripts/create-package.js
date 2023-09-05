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
  packageData.description = `Rebel Framework ${name}`;

  console.log(
    `Writing updated package.json to: ${newPackagePath}/package.json`
  );
  await fs.writeFile(
    `${newPackagePath}/package.json`,
    JSON.stringify(packageData, null, 2),
    'utf-8'
  );

  console.log(`Creating README.md at: ${newPackagePath}/README.md`);
  await fs.writeFile(
    `${newPackagePath}/README.md`,
    `# ${name}
  `,
    'utf-8'
  );

  console.log(
    `Copying tsconfig.json from: ${corePath}/tsconfig.json to ${newPackagePath}/tsconfig.json`
  );
  await fs.copyFile(
    `${corePath}/tsconfig.json`,
    `${newPackagePath}/tsconfig.json`
  );

  console.log(`Creating src directory at: ${newPackagePath}/src`);
  await fs.mkdir(`${newPackagePath}/src`);

  console.log(`Creating an index file`);
  const index = `console.log('Hello, ${name}!');
`;
  await fs.writeFile(`${newPackagePath}/src/index.ts`, index, 'utf-8');

  console.log(`Creating test directory at: ${newPackagePath}/test`);
  await fs.mkdir(`${newPackagePath}/test`);

  console.log(`Creating an index.test.ts file`);
  const test = `describe('${name}', () => {
  it('should ensure ${name} works', async () => {
    expect(true).toBeTruthy();
  });
});

`;
  await fs.writeFile(`${newPackagePath}/test/index.test.ts`, test, 'utf-8');

  console.log(`Adding package to workspace`);
  const rootPackageJson = await fs.readFile(`./package.json`, 'utf-8');
  const rootPackageData = JSON.parse(rootPackageJson);
  rootPackageData.workspaces = [
    ...rootPackageData.workspaces,
    `packages/${name}`,
  ];

  console.log(`Writing updated root package.json`);
  await fs.writeFile(
    `./package.json`,
    JSON.stringify(rootPackageData, null, 2),
    'utf-8'
  );

  console.log(
    `Copying jest.config.json from: ${corePath}/jest.config.json to ${newPackagePath}/jest.config.json`
  );
  await fs.copyFile(
    `${corePath}/jest.config.json`,
    `${newPackagePath}/jest.config.json`
  );
  console.log(`Adding package to jest.config.json`);
  const jestConfigJson = await fs.readFile(
    `${newPackagePath}/jest.config.json`,
    'utf-8'
  );
  const jestConfigData = JSON.parse(jestConfigJson);
  jestConfigData.displayName = name;

  console.log(`Writing updated jest.config.json`);
  await fs.writeFile(
    `${newPackagePath}/jest.config.json`,
    JSON.stringify(jestConfigData, null, 2),
    'utf-8'
  );

  console.log(`Created ${name} package successfully!`);
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
