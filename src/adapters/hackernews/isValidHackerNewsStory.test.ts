import { isValidHackerNewsStory } from "./isValidHackerNewsStory";

const validStoryObj = {
  id: 1,
  type: "story",
  by: "Becky Kane",
  title: "What to Do When You’re Mentally Exhausted",
  time: 100,
  url: "https://doist.com/blog/mental-fatigue/",
};

const requiredKeys = ["by", "time", "title", "url"];

describe("isValidHackerNewsStory", () => {
  it("returns true when passed a valid HN story object", () => {
    const result = isValidHackerNewsStory(validStoryObj);
    expect(result).toBe(true);
  });

  it("returns false for dead stories", () => {
    const deadStory = Object.assign({}, validStoryObj, { dead: true });
    const result = isValidHackerNewsStory(deadStory);
    expect(result).toBe(false);
  });

  it("returns false for deleted stories", () => {
    const deletedStory = Object.assign({}, validStoryObj, { deleted: true });
    const result = isValidHackerNewsStory(deletedStory);
    expect(result).toBe(false);
  });

  it("returns false when type is not a story", () => {
    const poll = Object.assign({}, validStoryObj, { type: "poll" });
    const result = isValidHackerNewsStory(poll);
    expect(result).toBe(false);
  });

  requiredKeys.forEach((key) => {
    it(`returns false when ${key} is undefined`, () => {
      const invalid = Object.assign({}, validStoryObj);
      // @ts-ignore
      delete invalid[key];
      const result = isValidHackerNewsStory(invalid);
      expect(result).toBe(false);
    });
  });
});
