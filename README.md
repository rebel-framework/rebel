# Rebel

## Tools

### Adding a new package

```sh
npx lerna create @rebel/name
```

### Add a new dependency to a specific workspace

```sh
yarn workspace @rebel/cli add -D typescript jest
```

### Run cli tool

```sh
node packages/cli/dist/cli.js
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

### TODO

[ ] Replace `/bin` with `/build`
[ ] Add automated version bump
