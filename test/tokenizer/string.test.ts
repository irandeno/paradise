import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { Tokenizer } from "../../tokenizer/mod.ts";

const tokenizer = new Tokenizer();

Deno.test("should return one character type", () => {
  tokenizer.setStates({ main: { one: "1" } });
  const tokens = tokenizer.tokenize("1");
  assertEquals(tokens, [{ value: "1", type: "one" }]);
});

Deno.test("should return custom string type", () => {
  tokenizer.setStates({ main: { custom: "something" } });
  const tokens = tokenizer.tokenize("something");
  assertEquals(tokens, [{ value: "something", type: "custom" }]);
});

Deno.test("should throw an syntax error", () => {
  tokenizer.setStates({ main: { valid: "valid" } });
  assertThrows(() => tokenizer.tokenize("invalid"));
});

Deno.test("should throw an empty state error", () => {
  tokenizer.setStates({});
  assertThrows(() => tokenizer.tokenize("invalid"));
});

Deno.test("should throw an empty state error", () => {
  tokenizer.setStates({});
  assertThrows(() => tokenizer.tokenize("anything"));
});
