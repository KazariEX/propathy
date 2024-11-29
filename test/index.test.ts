import { describe, expect, it } from "vitest";
import { deleteProperty, getProperty, hasProperty, parsePath, setProperty } from "../src";

describe("split", () => {
    it("normal", () => {
        const path = "foo.bar[0].baz";
        const props = parsePath(path);
        expect(props).toStrictEqual(["foo", "bar", "0", "baz"]);
    });

    it("escape", () => {
        const path = "foo\\..bar\\[0\\].baz\\";
        const props = parsePath(path);
        expect(props).toStrictEqual(["foo.", "bar[0]", "baz\\"]);
    });

    it("bracket follow bracket", () => {
        const path = "foo.bar[0][baz]";
        const props = parsePath(path);
        expect(props).toStrictEqual(["foo", "bar", "0", "baz"]);
    });

    it("start with bracket", () => {
        const path = "[0].foo.bar";
        const props = parsePath(path);
        expect(props).toStrictEqual(["0", "foo", "bar"]);
    });

    it("end with dot", () => {
        const path = "foo.bar.";
        const props = parsePath(path);
        expect(props).toStrictEqual(["foo", "bar", ""]);
    });

    it("end with empty bracket", () => {
        const path = "foo.bar[]";
        const props = parsePath(path);
        expect(props).toStrictEqual(["foo", "bar", ""]);
    });

    it("end without right bracket", () => {
        const path = "foo.bar[baz";
        const props = parsePath(path);
        expect(props).toStrictEqual(["foo", "bar", "baz"]);
    });
});

describe("get", () => {
    it("normal", () => {
        const obj = { foo: { bar: [{ baz: "qux" }] } };
        const path = "foo.bar[0].baz";
        expect(getProperty(obj, path)).toBe("qux");
    });

    it("with default value", () => {
        const obj = { foo: {} };
        const path = "foo.bar[0].baz";
        expect(getProperty(obj, path, "qux")).toBe("qux");
    });
});

describe("set", () => {
    it("normal", () => {
        const obj = { foo: { bar: [{}] } };
        const path = "foo.bar[0].baz";
        const value = "qux";
        setProperty(obj, path, value);
        expect(JSON.stringify(obj)).toBe(
            `{"foo":{"bar":[{"baz":"qux"}]}}`
        );
    });

    it("with recursion", () => {
        const obj = {};
        const path = "foo.bar[0].baz";
        const value = "qux";
        setProperty(obj, path, value);
        expect(JSON.stringify(obj)).toBe(
            `{"foo":{"bar":[{"baz":"qux"}]}}`
        );
    });
});

describe("has", () => {
    it("true", () => {
        const obj = { foo: { bar: [{ baz: "qux" }] } };
        const path = "foo.bar[0].baz";
        expect(hasProperty(obj, path)).toBeTruthy();
    });

    it("false", () => {
        const obj = { foo: { bar: [{ baz: "qux" }] } };
        const path = "foo.baz[0].bar";
        expect(hasProperty(obj, path)).toBeFalsy();
    });
});

describe("delete", () => {
    it("true", () => {
        const obj = { foo: { bar: [{ baz: "qux" }] } };
        const path = "foo.bar[0].baz";
        expect(deleteProperty(obj, path)).toBeTruthy();
        expect(JSON.stringify(obj)).toBe(
            `{"foo":{"bar":[{}]}}`
        );
    });

    it("false", () => {
        const obj = { foo: { bar: [{ baz: "qux" }] } };
        const path = "foo.bar[1]";
        expect(deleteProperty(obj, path)).toBeFalsy();
        expect(JSON.stringify(obj)).toBe(
            `{"foo":{"bar":[{"baz":"qux"}]}}`
        );
    });
});