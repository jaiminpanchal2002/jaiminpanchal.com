import { describe, it, expect } from "vitest";
import { toJson, parseJson, parseStringArray } from "./json";

describe("json helpers", () => {
  it("round-trips arrays", () => {
    expect(parseStringArray(toJson(["a", "b"]))).toEqual(["a", "b"]);
  });

  it("parseStringArray is null/garbage safe", () => {
    expect(parseStringArray(null)).toEqual([]);
    expect(parseStringArray(undefined)).toEqual([]);
    expect(parseStringArray("not json")).toEqual([]);
    expect(parseStringArray('{"a":1}')).toEqual([]); // non-array
  });

  it("parseJson returns fallback on bad input", () => {
    expect(parseJson('{"a":1}', {})).toEqual({ a: 1 });
    expect(parseJson("nope", { fallback: true })).toEqual({ fallback: true });
    expect(parseJson(null, 5)).toBe(5);
  });
});
