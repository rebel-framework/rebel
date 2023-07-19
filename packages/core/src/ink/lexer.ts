export const parser = (tokens) => {
  let i = 0;

  function walk() {
    let token = tokens[i];

    if (token.type === "text") {
      i++;
      return { type: "text", value: token.value };
    }

    if (token.type === "variable") {
      i++;
      return { type: "variable", value: token.value };
    }

    if (token.type === "startLoop") {
      let node = {
        type: "loop",
        arrayName: token.arrayName,
        itemName: token.itemName,
        body: [],
      };
      token = tokens[++i];

      while ((token = tokens[i]) && token.type !== "endLoop") {
        node.body.push(walk());
        token = tokens[i];
      }

      i++;
      return node;
    }
  }

  let ast = { type: "program", body: [] };

  while (i < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
};
