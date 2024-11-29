# Propathy

[![version](https://img.shields.io/npm/v/propathy?label=npm)](https://www.npmjs.com/package/propathy)
[![downloads](https://img.shields.io/npm/dm/propathy?label=downloads)](https://www.npmjs.com/package/propathy)
[![license](https://img.shields.io/npm/l/propathy?label=license)](/LICENSE)

Operate objects via dot path.

## Install

```shell
pnpm i propathy
```

## Usage

```ts
import { getProperty, setProperty, hasProperty, deleteProperty } from "propathy";

const target = { foo: { bar: [{ baz: "qux" }] } };

getProperty(target, "foo.bar[0].baz");
// "qux"

getProperty(target, "foo.bar[1]");
// undefined

setProperty(target, "foo.bar[0].baz", "kzr");
console.log(target);
// { foo: { bar: [{ baz: "kzr" }] } }

hasProperty(target, "foo.bar[0].baz");
// true

hasProperty(target, "foo.bar[1]");
// false

deleteProperty(target, "foo.bar[0].baz");
// true

console.log(target);
// { foo: { bar: [{}] } }
```