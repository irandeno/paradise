import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { Tokenizer } from "../../tokenizer/mod.ts";

const tokenizer = new Tokenizer();

Deno.test("should return one character type", () => {
  tokenizer.setStates({ main: { one: { match: "1" } } });
  const tokens = tokenizer.tokenize("1");
  assertEquals(tokens, [{ value: "1", type: "one" }]);
});

Deno.test("should return one character type", () => {
  tokenizer.setStates({ main: { word: { match: /\w+/ } } });
  const tokens = tokenizer.tokenize("something");
  assertEquals(tokens, [{ value: "something", type: "word" }]);
});

Deno.test("shouldn't return ignored matches", () => {
  tokenizer.setStates({
    main: {
      ignored: { match: ["one", "_"], ignore: true },
      valid: { match: "two", ignore: false },
    },
  });
  const tokens = tokenizer.tokenize("one_two");
  assertEquals(tokens, [{ value: "two", type: "valid" }]);
});
