import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { Tokenizer } from "../../tokenizer/mod.ts";

const tokenizer = new Tokenizer();

Deno.test("should return single digit type", () => {
  tokenizer.setStates({ main: { digit: /\d/ } });
  const tokens = tokenizer.tokenize("12");
  assertEquals(tokens, [
    { value: "1", type: "digit" },
    { value: "2", type: "digit" },
  ]);
});

Deno.test("should return any number type", () => {
  tokenizer.setStates({ main: { number: /\d+/ } });
  const tokens = tokenizer.tokenize("12");
  assertEquals(tokens, [{ value: "12", type: "number" }]);
});

Deno.test("should throw with syntax error", () => {
  tokenizer.setStates({ main: { number: /\d+/ } });
  assertThrows(() => tokenizer.tokenize("abc"));
});
