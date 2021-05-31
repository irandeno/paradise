import {
  assertEquals,
  assertMatch,
  assertNotMatch,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";

import { parse } from "../mod.ts";

Deno.test("should return single identifier as a regex", () => {
  assertEquals(parse("{name:string}"), /^(?<name>.+)$/);
});

Deno.test("should return multiple identifiers as a regex", () => {
  assertEquals(
    parse("{firstName:string}_{lastName:string}"),
    /^(?<firstName>.+)_(?<lastName>.+)$/,
  );
});

Deno.test(
  "should return identifier concatenated with a custom character",
  () => {
    assertEquals(parse("@{username:string}"), /^@(?<username>.+)$/);
  },
);

Deno.test("should match string with one string parameter", () => {
  const username = parse("@{username:string}");
  assertMatch("@disizali", username as RegExp);
});

Deno.test("should match string with multiple string parameter", () => {
  const sum = parse("/{command:string}_{type:string}");
  assertMatch("/download_music", sum as RegExp);
});

Deno.test("shouldn't match string with multiple string parameter", () => {
  const multiply = parse("{firstName:string}_{lastName:string}");
  assertNotMatch("ali*hasani", multiply as RegExp);
});
