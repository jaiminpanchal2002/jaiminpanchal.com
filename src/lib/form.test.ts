import { describe, it, expect } from "vitest";
import {
  str,
  optionalStr,
  bool,
  int,
  commaList,
  lineList,
  slugify,
} from "./form";

function fd(entries: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) f.append(k, v);
  return f;
}

describe("form helpers", () => {
  it("str trims and optionalStr nulls empties", () => {
    const f = fd({ a: "  hi  ", b: "   " });
    expect(str(f, "a")).toBe("hi");
    expect(optionalStr(f, "b")).toBeNull();
    expect(optionalStr(f, "a")).toBe("hi");
  });

  it("bool reads checkbox on/true", () => {
    expect(bool(fd({ x: "on" }), "x")).toBe(true);
    expect(bool(fd({ x: "true" }), "x")).toBe(true);
    expect(bool(fd({}), "x")).toBe(false);
  });

  it("int parses with fallback", () => {
    expect(int(fd({ n: "42" }), "n")).toBe(42);
    expect(int(fd({ n: "abc" }), "n", 7)).toBe(7);
    expect(int(fd({}), "n", 3)).toBe(3);
  });

  it("commaList and lineList trim and drop empties", () => {
    expect(commaList(fd({ t: "a, b ,,c" }), "t")).toEqual(["a", "b", "c"]);
    expect(lineList(fd({ t: "a\n\n b \nc" }), "t")).toEqual(["a", "b", "c"]);
  });

  it("slugify produces url-safe slugs", () => {
    expect(slugify("Hello World! 2026")).toBe("hello-world-2026");
    expect(slugify("  Trim -- Me  ")).toBe("trim-me");
  });
});
