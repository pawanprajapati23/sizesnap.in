import { cn } from "./utils"

describe("cn utility", () => {
  it("merges basic classes", () => {
    expect(cn("class1", "class2")).toBe("class1 class2")
  })

  it("handles conditional classes", () => {
    expect(cn("class1", true && "class2", false && "class3")).toBe("class1 class2")
  })

  it("merges tailwind classes and resolves conflicts", () => {
    // text-red-500 should be overwritten by text-blue-500
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  it("handles objects with boolean values", () => {
    expect(cn({
      "class1": true,
      "class2": false,
      "class3": true
    })).toBe("class1 class3")
  })

  it("handles arrays of classes", () => {
    expect(cn(["class1", "class2"])).toBe("class1 class2")
  })

  it("handles falsy values (null, undefined, false, 0)", () => {
    expect(cn("class1", null, undefined, false, 0, "class2")).toBe("class1 class2")
  })

  it("handles nested arrays", () => {
    expect(cn(["class1", ["class2", "class3"]])).toBe("class1 class2 class3")
  })
})
