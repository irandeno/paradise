import {
  assertEquals,
  assertMatch,
  assertNotMatch,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";

import { parse } from "../mod.ts";

Deno.test("should recognize no param-type as 'any' and cast to string", () => {
  assertEquals(parse("{name}"), /(?<name>.+)/);
});

Deno.test("should return multiple identifiers as a regex", () => {
  assertEquals(
    parse("{firstName}_{lastName}"),
    /(?<firstName>.+)_(?<lastName>.+)/,
  );
});

Deno.test(
  "should return identifier concatenated with a custom character",
  () => {
    assertEquals(parse("@{username}"), /@(?<username>.+)/);
  },
);

Deno.test("should match 'any' with one 'any' parameter", () => {
  const username = parse("@{username}");
  assertMatch("@disizali", username as RegExp);
});

Deno.test("should match 'any' with multiple 'any' parameter", () => {
  const sum = parse("/{command}_music{number}");
  assertMatch("/download_music1", sum as RegExp);
});

Deno.test("shouldn't match 'any' with multiple 'any' parameter", () => {
  const multiply = parse("{user}_{id}");
  assertNotMatch("ali*20", multiply as RegExp);
});
