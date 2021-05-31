import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { Tokenizer } from "../../tokenizer/mod.ts";

const tokenizer = new Tokenizer();

Deno.test(
  "should return parameter type and identifier from another state",
  () => {
    tokenizer.setStates({
      main: { startParam: { match: "{", push: "param" } },
      param: {
        identifier: /[a-zA-Z0-]+/,
        endParam: { match: "}", pop: 1 },
      },
    });
    const tokens = tokenizer.tokenize("{id}");
    assertEquals(tokens, [
      { value: "{", type: "startParam" },
      { value: "id", type: "identifier" },
      { value: "}", type: "endParam" },
    ]);
  },
);

Deno.test("should return string type from main state", () => {
  tokenizer.setStates({
    main: { startParam: { match: "{", push: "param" }, specialToken: "*" },
    param: {
      identifier: /[a-zA-Z0-]+/,
      endParam: { match: "}", pop: 1 },
      wrongSpecialToken: "*",
    },
  });
  const tokens = tokenizer.tokenize("{id}*");
  assertEquals(tokens, [
    { value: "{", type: "startParam" },
    { value: "id", type: "identifier" },
    { value: "}", type: "endParam" },
    { value: "*", type: "specialToken" },
  ]);
});

Deno.test("should throw when no state found for push", () => {
  tokenizer.setStates({
    main: { startParam: { match: "{", push: "param" } },
    wrongParam: {},
  });
  assertThrows(() => tokenizer.tokenize("{id}"));
});

Deno.test("should throw when no state found for pop", () => {
  tokenizer.setStates({
    main: { startParam: { match: "{", pop: 1 } },
  });
  assertThrows(() => tokenizer.tokenize("{id}"));
});
