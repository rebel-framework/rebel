import { Command } from '@rebel/core';
import { OpenAIApi } from 'openai';

export const ai: Command = (args: string[]) => {
  // Parse the args
  const subCommand = args[0];
  const remainingArgs = args.slice(1);

  switch (subCommand) {
    case 'ask':
      // Implementation of the 'ask' sub-command
      handlePromptCommand(remainingArgs);
      break;

    case 'refactor':
      // Implementation of the 'refactor' sub-command
      handlePromptCommand(remainingArgs);
      break;

    case 'test':
      // Implementation of the 'test' sub-command
      handlePromptCommand(remainingArgs);
      break;

    case 'analyze':
      // Implementation of the 'analyze' sub-command
      handlePromptCommand(remainingArgs);
      break;

    case 'doc':
      // Implementation of the 'doc' sub-command
      handlePromptCommand(remainingArgs);
      break;

    case 'prompt':
      // Implementation of the 'prompt' sub-command
      handlePromptCommand(remainingArgs);
      break;

    case 'suggest':
      // Implementation of the 'suggest' sub-command
      handleSuggestCommand(remainingArgs);
      break;

    default:
      throw new Error(`Unknown sub-command: ${subCommand}`);
  }
};

// const openai = new OpenAIApi(process.env.OPENAI_API_KEY);

const handlePromptCommand = async (args: string[]) => {
  const promptText = args[0];

  // Call to OpenAI's GPT-3 model with the prompt text as input
  //   const response = await openai.complete({
  //     engine: "davinci-codex",
  //     prompt: promptText,
  //     temperature: 0.5, // Controls the randomness of the output. 0 makes it deterministic.
  //     max_tokens: 100, // Controls the maximum length of the output.
  //   });

  //   console.log(`Generated code: ${response.choices[0].text}`);
};

const handleSuggestCommand = (args: string[]) => {
  // Call to AI code improvement function
  console.log('Generating code suggestions...');
};
