import { Command } from "../types";

import { pluralize } from "@rebel/core/dist/str";

interface TemplateContext {
  [key: string]: any;
}

type TemplateToken =
  | { type: "VARIABLE"; value: string }
  | { type: "ESCAPED_VARIABLE"; value: string }
  | { type: "IF" }
  | { type: "ELSE" }
  | { type: "ENDIF" }
  | { type: "WHILE" }
  | { type: "ENDWHILE" }
  | { type: "FOR"; value: string }
  | { type: "ENDFOR" };

function tokenize(template: string): TemplateToken[] {
  const regex = /{{.*?}}|@if|@else|@endif|@while|@endwhile|@for.*?@endfor/gs;
  const tokens: TemplateToken[] = [];

  let match;
  let lastIndex = 0;

  while ((match = regex.exec(template)) !== null) {
    const text = match[0];
    const index = match.index;

    if (index !== lastIndex) {
      tokens.push({
        type: "VARIABLE",
        value: template.substring(lastIndex, index),
      });
    }

    if (text.startsWith("{{")) {
      const variable = text.substring(2, text.length - 2).trim();
      tokens.push({ type: "ESCAPED_VARIABLE", value: variable });
    } else if (text === "@if") {
      tokens.push({ type: "IF" });
    } else if (text === "@else") {
      tokens.push({ type: "ELSE" });
    } else if (text === "@endif") {
      tokens.push({ type: "ENDIF" });
    } else if (text === "@while") {
      tokens.push({ type: "WHILE" });
    } else if (text === "@endwhile") {
      tokens.push({ type: "ENDWHILE" });
    } else if (text.startsWith("@for")) {
      const variable = text.substring(4, text.indexOf("of")).trim();
      tokens.push({ type: "FOR", value: variable });
    } else if (text === "@endfor") {
      tokens.push({ type: "ENDFOR" });
    }

    lastIndex = index + text.length;
  }

  if (lastIndex < template.length) {
    tokens.push({ type: "VARIABLE", value: template.substring(lastIndex) });
  }

  return tokens;
}
function render(template: string, context: TemplateContext): string {
  const tokens = tokenize(template);
  let output = "";

  const stack: TemplateToken[] = [];
  const loopStack: { variable: string; index: number; length: number }[] = [];
  let skipElseBlock = false;

  for (const token of tokens) {
    if (token.type === "VARIABLE") {
      output += token.value;
    } else if (token.type === "ESCAPED_VARIABLE") {
      const value = context[token.value];
      output += escapeHTML(value);
    } else if (token.type === "IF") {
      stack.push({ type: "IF" });
    } else if (token.type === "ELSE") {
      const ifToken = stack.pop();

      if (ifToken.type !== "IF") {
        throw new Error("Mismatched @if/@else/@endif");
      }

      if (!skipElseBlock) {
        stack.push({ type: "ELSE" });
      }
    } else if (token.type === "ENDIF") {
      const ifToken = stack.pop();

      if (ifToken.type !== "IF" && ifToken.type !== "ELSE") {
        throw new Error("Mismatched @if/@else/@endif");
      }

      skipElseBlock = false;
    } else if (token.type === "WHILE") {
      stack.push({ type: "WHILE" });
    } else if (token.type === "ENDWHILE") {
      const whileToken = stack.pop();

      if (whileToken.type !== "WHILE") {
        throw new Error("Mismatched @while/@endwhile");
      }

      //   const condition = context[whileToken.value];

      //   if (condition) {
      //     stack.push({ type: "WHILE" });
      //   }
    } else if (token.type === "FOR") {
      //   const variable = pluralize(token.value);
      const variable = token.value;
      const items = context[variable];

      console.log({ variable, items, context });

      if (Array.isArray(items)) {
        const loopItem = items[0];
        loopStack.push({ variable, index: 0, length: items.length });

        // Update the context with the loop item
        context[variable] = loopItem;

        // stack.push({ type: "FOR" });
      }
    } else if (token.type === "ENDFOR") {
      const forToken = stack.pop();

      if (forToken.type !== "FOR") {
        throw new Error("Mismatched @for/@endfor");
      }

      const loopData = loopStack.pop();

      if (!loopData) {
        throw new Error("Mismatched @for/@endfor");
      }

      const { variable, index, length } = loopData;

      if (index < length - 1) {
        // Update the context with the next loop item
        const items = context[variable];
        const nextLoopItem = items[index + 1];
        context[variable] = nextLoopItem;

        loopStack.push({ variable, index: index + 1, length });
        // stack.push({ type: "FOR" });
      }
    }
  }

  return output;
}

function escapeHTML(value: any): string {
  return String(value).replace(/[&<>"'\/]/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#039;";
      case "/":
        return "&#x2F;";
      default:
        return char;
    }
  });
}

export const ink: Command = async (args: string[]) => {
  // Example usage
  const template = `
  <h1>{{ title }}</h1>

  <ul>
    @for item of items
      <li>{{ item }}</li>
    @endfor
  </ul>

  @if showFooter
    <footer>{{ footerText }}</footer>
  @else
    <div>No footer</div>
  @endif
`;

  const context: TemplateContext = {
    title: "My Template",
    items: ["Apple", "Banana", "Orange"],
    showFooter: true,
    footerText: "Footer content",
  };

  const output = render(template, context);
  console.log(output);
};
