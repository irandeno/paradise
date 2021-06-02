import {
  assertEquals,
  assertMatch,
  assertNotMatch,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";

import { parse } from "../mod.ts";

Deno.test("should return exact same string with an identifier", () => {
  assertEquals(parse("{name:'ali'}"), /^(?<name>ali)$/);
});

Deno.test("should return selective type regex", () => {
  assertEquals(
    parse("{nature:'human'|'robot'}"),
    /^(?<nature>human|robot)$/,
  );
});

Deno.test("should match string with one selective parameter", () => {
  const nature = parse("{nature:'human'|'robot'}");
  assertMatch("human", nature as RegExp);
});

Deno.test("should match string with each of selective parameter choices", () => {
  const nature = parse("{nature:'human'|'robot'|'alien'}");
  assertMatch("human", nature as RegExp);
  assertMatch("robot", nature as RegExp);
  assertMatch("alien", nature as RegExp);
});

Deno.test("should match string with multiple selective parameter", () => {
  const naturePlanet = parse(
    "{nature:'human'|'alien'}_{planet:'earth'|'pluto'}",
  );
  assertMatch("human_earth", naturePlanet as RegExp);
  assertMatch("alien_pluto", naturePlanet as RegExp);
});

Deno.test("shouldn't match selective parameter", () => {
  const language = parse("{language:'javascript'|'typescript'}");
  assertNotMatch("otherscript", language as RegExp);
});
