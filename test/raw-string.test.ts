import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { parse } from "../mod.ts";
Deno.test("should return exact same string", () => {
  assertEquals(parse("abc"), "abc");
  assertEquals(parse("123"), "123");
  assertEquals(parse("!@#"), "!@#");
});

Deno.test("should not return exact same string", () => {
  assertNotEquals(parse(":id"), ":id");
  assertNotEquals(parse("{something}"), "{something}");
});
