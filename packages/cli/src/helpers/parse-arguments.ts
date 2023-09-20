import { Signature } from '../types';

export default function parseArguments(
  args: string[],
  signature: Signature
): any {
  const parsedArgs = {};

  for (let i = 0; i < args.length; i++) {
    let currentArg = args[i];
    let value = null;

    if (currentArg.includes('=')) {
      const parts = currentArg.split('=');
      currentArg = parts[0];
      value = parts[1];
    }

    for (const argName in signature) {
      const {
        type,
        name,
        short,
        default: defaultValue,
        choices,
      } = signature[argName];

      if (currentArg === name || (short && currentArg === short)) {
        if (!value && args[i + 1] && !args[i + 1].startsWith('-')) {
          value = args[i + 1];
          i++; // Skip the next item as we've consumed it.
        }

        switch (type) {
          case 'string':
            parsedArgs[argName] = value || defaultValue;
            break;
          case 'number':
            parsedArgs[argName] = Number(value) || defaultValue;
            break;
          case 'boolean':
            parsedArgs[argName] = value === 'true' || defaultValue === true;
            break;
          case 'choice':
            if (choices?.includes(value)) {
              parsedArgs[argName] = value;
            } else {
              parsedArgs[argName] = defaultValue;
            }
            break;
        }
      }
    }
  }

  return parsedArgs;
}
