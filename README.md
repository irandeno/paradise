# Paradise

![paradise logo](https://i.ibb.co/12J6h0t/paradise-small.png)

## **Smart and smooth Dynamic Pattern Parser And Tokenizer**

**Paradise Parser** is a dynamic pattern parser with the ability to
automatically detect the type of parameters and convert pattern to regular
expressions that can be used in any type of trigger and other uses that are used
without the need to write hard-to-read Regular expressions.

**Paradise Tokenizer** is also a tool for Tokenizing strings in multiple level
with support of strings, regex and arrays.

## Parser

- ### Getting Started

  ```typescript
  import { parse } from "https://deno.land/x/paradise@0.2.0/mod.ts";
  ```

- ### Usage

  - `parse raw string`

    ```typescript
    parse("signup"); // => "signup"
    // can match : signup
    ```

  - `parse string parameter`

    ```typescript
    parse("@{username:string}"); // => /@(?<username>.+)/
    // can match : @disizali, @anyId
    ```

  - `parse number parameter`

    ```typescript
    parse("/id_{id:number}"); // => /id_(?<command>\d+>)/
    // can match : /id_1, /id_50
    ```

  - `parse concatenated parameters`

    ```typescript
    parse("/{command}_music{id:number}"); // => \/(?<command>.+)_music(?<id>\d+)
    // can match : /download_music1, /delete_music2
    ```

## Tokenizer

- ### Getting Started

  ```typescript
  import { Tokenizer } from "https://deno.land/x/paradise@0.2.0/tokenizer/mod.ts";
  ```

- ### Usage

  - `string matcher` Achieve characters that exactly match the defined string

    ```typescript
    const tokenizer = new Tokenizer({
      main: {
        one: "1",
      },
    });

    tokenizer.tokenize("1"); // => [ { type: "one", value: "1" } ]
    ```

  - `regex matcher` Achieve characters that exactly match the defined RegExp

    ```typescript
    import { Tokenizer } from "https://deno.land/x/paradise@0.2.0/tokenizer/mod.ts";

    const tokenizer = new Tokenizer({
      main: {
        digit: /\d/,
      },
    });

    tokenizer.tokenize("1"); // => [ { type: "digit", value: "1" } ]
    ```

  - `array matcher` Achieve characters that match any of defined strings

    ```typescript
    import { Tokenizer } from "https://deno.land/x/paradise@0.2.0/tokenizer/mod.ts";

    const tokenizer = new Tokenizer({
      main: {
        triple: ["one", "two", "three"],
      },
    });

    tokenizer.tokenize("three"); // => [ { type: "triple", value: "three" } ]
    ```

  - `options` Matcher can be an object with some customizations

    ```typescript
    import { Tokenizer } from "https://deno.land/x/paradise@0.2.0/tokenizer/mod.ts";

    const tokenizer = new Tokenizer({
      main: {
        digit: { match: /\d/ },
        underline: { match: "_", ignore: true },
      },
    });

    tokenizer.tokenize("1_2"); // => [ { type: "digit", value: "1" }, { type: "digit", value: "2" } ]
    ```

    ```typescript
    import { Tokenizer } from "https://deno.land/x/paradise@0.2.0/tokenizer/mod.ts";

    const tokenizer = new Tokenizer({
      main: {
        vehicle: { match: "car", value: () => "airplane" },
      },
    });

    tokenizer.tokenize("car"); // => [ { type: "vehicle", value: "airplane" } ]
    ```

  - `multi-state matcher` states can be define in multiple levels and match with
    different set of rules

    ```typescript
    import { Tokenizer } from "https://deno.land/x/paradise@0.2.0/tokenizer/mod.ts";

    const tokenizer = new Tokenizer({
      main: {
        startParam: { match: "{", push: "param", ignore: true },
      },
      param: {
        identifier: /\w+/,
        endParam: { match: "}", pop: 1, ignore: true },
      },
    });

    tokenizer.tokenize("{username}"); // => [ { type: "identifier", value: "username" } ]
    ```
