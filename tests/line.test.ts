import { describe, it, expect } from "vitest";
import { parseLineUrls } from "../src/lib/line";
const slugs = ["grizzly", "rabbit"];
describe("per-type LINE URLs", () => {
  it("is empty when unset", () => { expect(parseLineUrls("", slugs)).toEqual({}); expect(parseLineUrls("  ", slugs)).toEqual({}); });
  it("accepts a slug → https URL object", () => { expect(parseLineUrls('{"grizzly":"https://lin.ee/a"}', slugs)).toEqual({ grizzly: "https://lin.ee/a" }); });
  it("fails the build on a typo instead of silently falling back", () => {
    expect(() => parseLineUrls("{grizzly:1}", slugs)).toThrow(/valid JSON/);
    expect(() => parseLineUrls('["https://lin.ee/a"]', slugs)).toThrow(/JSON object/);
    expect(() => parseLineUrls('{"grizly":"https://lin.ee/a"}', slugs)).toThrow(/unknown type "grizly"/);
    expect(() => parseLineUrls('{"rabbit":"http://lin.ee/a"}', slugs)).toThrow(/https/);
  });
});
