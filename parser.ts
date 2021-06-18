import { Token, Tokenizer } from "./tokenizer/mod.ts";
const regexTokens = ["+", "?", "[", "]", "*", ".", "|", "^", "$", "(", ")"];

export function parse(pattern: string): string | RegExp {
  if (isString(pattern) && isRawText(pattern)) {
    return pattern;
  }
  const states = {
    main: {
      startParam: { match: "{", push: "param", ignore: true },
      regexToken: {
        match: regexTokens,
        value: (token: string) => `\\${token}`,
      },
      string: /(?:\\["\\]|[^\n"\\])/,
    },
    param: {
      type: ["string", "number", "any"],
      colon: { match: ":", ignore: true },
      identifier: /[a-zA-Z0-9]+/,
      explicitValue: {
        match: [/"(?:\\["\\]|[^\n"\\])*?"/, /'(?:\\["\\]|[^\n"\\])*?'/],
        value: (val: string) =>
          val.startsWith('"')
            ? val.replaceAll('"', "")
            : val.replaceAll("'", ""),
      },
      or: "|",
      endParam: { match: "}", pop: 1 },
    },
  };

  const tokenizer = new Tokenizer(states);
  const tokens = tokenizer.tokenize(pattern);
  let result = "";
  for (const token of tokens) {
    if (token.type === "string" || token.type === "regexToken") {
      result = result.concat(token.value);
    } else if (token.type === "identifier") {
      const currentTokenIndex = tokens.indexOf(token);
      const restOfArray = tokens.slice(currentTokenIndex + 1);
      if (
        !restOfArray.length ||
        !restOfArray.some((item) => item.type === "endParam")
      ) {
        throw new Error("unclosed parameter");
      }
      const nextElement = restOfArray[0];
      const paramType = typeof nextElement !== "undefined"
        ? nextElement.type === "type"
          ? nextElement.value
          : nextElement.type === "explicitValue"
          ? handleExplicitValues(restOfArray)
          : "string"
        : "string";
      result = result.concat(parameterToGroup(token.value, paramType));
    }
  }
  return new RegExp(`^${result}$`);
}

const isString = (pattern: unknown): pattern is string =>
  typeof pattern === "string";

const isRawText = (pattern: string) =>
  !pattern.includes(":") && !pattern.includes("{");

function parameterToGroup(identifier: string, paramType: string): string {
  let matcher = "";
  switch (paramType) {
    case "string":
      matcher = ".+";
      break;
    case "number":
      matcher = "\\d+";
      break;
    default:
      matcher = paramType;
  }
  return `(?<${identifier}>${matcher})`;
}

function handleExplicitValues(restOfElements: Token[]) {
  let total = "";
  let elements = restOfElements;
  while (
    elements[0].type === "or" ||
    elements[0].type === "explicitValue"
  ) {
    if (elements[0].type === "explicitValue") {
      total = total.concat(elements[0].value);
    } else if (elements[0].type === "or") {
      total = total.concat(elements[0].value);
    }
    elements.shift();
  }
  return total;
}
