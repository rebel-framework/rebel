import { Signature } from '../types';

export default function parseArguments(
  args: string[],
  signature: Signature
): any {
  const parsedArgs: { [key: string]: any } = {};
  const usedIndices: number[] = []; // To track which args we've already parsed

  // Parsing positional arguments
  const positionalKeys = Object.keys(signature.arguments || {});
  for (let i = 0; i < positionalKeys.length; i++) {
    const argKey = positionalKeys[i];
    const argDef = signature.arguments[argKey];
    if (i < args.length && !args[i].startsWith('-')) {
      parsedArgs[argKey] = extractValue(argDef, args[i]);
      usedIndices.push(i);
    } else {
      parsedArgs[argKey] = argDef.default;
    }
  }

  // Parsing options arguments
  for (let i = 0; i < args.length; i++) {
    if (usedIndices.includes(i)) continue; // Skip arguments we've already parsed

    let currentArg = args[i];
    let value = null;

    if (currentArg.includes('=')) {
      const parts = currentArg.split('=');
      currentArg = parts[0];
      value = parts[1];
    }

    for (const optionName in signature.options) {
      const {
        type,
        name,
        short,
        default: defaultValue,
        choices,
      } = signature.options[optionName];

      if (currentArg === name || (short && currentArg === short)) {
        usedIndices.push(i);

        if (!value && args[i + 1] && !args[i + 1].startsWith('-')) {
          value = args[i + 1];
          usedIndices.push(i + 1);
          i++; // Skip the next item as we've consumed it.
        }

        parsedArgs[optionName] = extractValue(
          {
            type,
            default: defaultValue,
            choices,
          },
          value
        );
        break; // Break out of the options loop as we found a match
      }
    }
  }

  return parsedArgs;
}

function extractValue(
  argDef: { type: string; default?: any; choices?: string[] },
  value: string
): any {
  switch (argDef.type) {
    case 'string':
      return value || argDef.default;
    case 'number':
      return Number(value) || argDef.default;
    case 'boolean':
      return value === 'true' || argDef.default === true;
    case 'choice':
      return argDef.choices?.includes(value) ? value : argDef.default;
    default:
      return value;
  }
}
