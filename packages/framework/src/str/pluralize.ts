export const pluralize = (word: string, count: number): string => {
  if (count === 1) {
    return word; // Singular form for count of 1
  }

  // Pluralize irregular words
  const irregulars: { singular: string; plural: string }[] = [
    { singular: "child", plural: "children" },
    { singular: "person", plural: "people" },
    { singular: "ox", plural: "oxen" },
    // Add more irregular words as needed
  ];

  const irregular = irregulars.find((irregular) => irregular.singular === word);
  if (irregular) {
    return irregular.plural;
  }

  // Pluralize regular words
  const rules: [RegExp, string][] = [
    [/s?$/, "s"], // Add 's' at the end
    [/([^aeiou])y$/, "$1ies"], // Replace 'y' with 'ies' if preceded by a consonant
    [/([sxzh])$/, "$1es"], // Add 'es' for words ending with 's', 'x', 'z', 'h'
    [/(?:([^f])fe|([lr])f)$/, "$1$2ves"], // Replace 'f' or 'fe' with 'ves'
    [/([ti])um$/, "$1a"], // Replace 'um' with 'a' for words ending with 'ium'
    // Add more pluralization rules as needed
  ];

  for (const [pattern, replacement] of rules) {
    if (pattern.test(word)) {
      return word.replace(pattern, replacement);
    }
  }

  // Return the word as is if no matching rules are found
  return word;
};
