import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { Tokenizer } from "../../tokenizer/mod.ts";

const tokenizer = new Tokenizer();

Deno.test("should return one of items in array", () => {
  tokenizer.setStates({ main: { triple: ["one", "two", "three"] } });
  const tokens = tokenizer.tokenize("one");
  assertEquals(tokens, [{ value: "one", type: "triple" }]);
});

Deno.test("should return one item in single array", () => {
  tokenizer.setStates({ main: { name: ["ali"] } });
  const tokens = tokenizer.tokenize("ali");
  assertEquals(tokens, [{ value: "ali", type: "name" }]);
});

Deno.test("should throw syntax error when no item in array founds", () => {
  tokenizer.setStates({ main: { number: ["one", "two"] } });
  assertThrows(() => tokenizer.tokenize("three"));
});
