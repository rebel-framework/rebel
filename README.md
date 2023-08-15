# Rebel Framework

Monorepo used to build the following packages published on npm:

- @rebel-framework/core
- @rebel-framework/cli
- @rebel-framework/stack

## Development

### Add a new dependency to a specific workspace

```sh
yarn workspace @rebel/cli add -D typescript jest
```

### Run cli tool

```sh
node packages/cli/build/cli.js
```

### Develop using `rebel`

```sh
cd packages/cli && npm link
```

You can now use `rebel`

### Recompile typescript upon changes

```sh
npx lerna run watch
```

### Run a command against all packages at once

```sh
yarn lerna exec -- yarn link
```
