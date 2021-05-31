import {
  assertEquals,
  assertMatch,
  assertNotMatch,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";

import { parse } from "../mod.ts";

Deno.test("should return single identifier as a regex", () => {
  assertEquals(parse("{id:number}"), /(?<id>\d+)/);
});

Deno.test("should return multiple identifiers as a regex", () => {
  assertEquals(parse("{id:number}_{rank:number}"), /(?<id>\d+)_(?<rank>\d+)/);
});

Deno.test("should return identifier concatenated with a custom string", () => {
  assertEquals(parse("user:{id:number}"), /user:(?<id>\d+)/);
});

Deno.test("should match string with one number parameter", () => {
  const userId = parse("user:{id:number}");
  assertMatch("user:1", userId as RegExp);
});

Deno.test("should match string with multiple number parameter", () => {
  const sum = parse("{first:number}+{second:number}");
  assertMatch("1+2", sum as RegExp);
});

Deno.test("shouldn't match string with multiple number parameter", () => {
  const multiply = parse("{first:number}*{second:number}");
  assertNotMatch("4/2", multiply as RegExp);
});
