type Trigger = string;
export function parse(pattern: string): Trigger {
  if (isString(pattern) && isRawText(pattern)) {
    return pattern;
  }
  return "not-implemented-yet";
}

const isString = (pattern: unknown): pattern is string =>
  typeof pattern === "string";

const isRawText = (pattern: string) =>
  !pattern.includes(":") && !pattern.includes("{");
