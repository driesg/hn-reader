import * as Validator from "../adapters/hackernews/isValidHackerNewsStory";
import { NewsClient } from "./NewsClient";
import { NewsReader } from "./NewsReader";
import { Story } from "./Story";
import { ItemNotFoundError } from "./utils/ItemNotFoundError";

describe("NewsReader", () => {
  let reader: NewsReader;
  let mockGetItem = jest.fn();
  let mockGetLatest = jest.fn().mockResolvedValue(3);
  const originalValidator = Validator.isValidHackerNewsStory;
  const mockValidator = jest.fn().mockReturnValue(true);
  const mockLogService = jest.fn();
  console.warn = mockLogService;

  let mockClient: NewsClient = {
    getLatestItemId: () => mockGetLatest(),
    getItem: () => mockGetItem(),
  };

  beforeEach(() => {
    reader = new NewsReader(mockClient);
    // @ts-ignore - let us mock the module
    Validator.isValidHackerNewsStory = mockValidator;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("loads the latest Story from the API", async () => {
    mockGetItem = jest.fn().mockResolvedValue({
      by: "author",
      time: 33,
      id: 3,
      type: "story",
      title: "loads the latest Story from the API",
      url: "http://url-to-story.com",
    });
    const gen = reader.getPreviousStory();
    const next = await gen.next();

    expect(next.value).toStrictEqual(
      new Story({
        author: "author",
        created_at: 33,
        id: 3,
        title: "loads the latest Story from the API",
        url: "http://url-to-story.com",
      })
    );
  });

  it("loads multiple stories from the API", async () => {
    mockGetItem = jest
      .fn()
      .mockResolvedValueOnce({
        by: "author",
        time: 33,
        id: 3,
        title: "title 3",
        type: "story",
        url: "http://url-to-story.com",
      })
      .mockResolvedValueOnce({
        by: "author",
        time: 22,
        id: 2,
        title: "title 2",
        type: "story",
        url: "http://url-to-story.com",
      })
      .mockResolvedValueOnce({
        by: "author",
        time: 11,
        id: 1,
        title: "title 1",
        type: "story",
        url: "http://url-to-story.com",
      });
    const gen = reader.getPreviousStory();
    const first = await gen.next();

    expect(first.value).toStrictEqual(
      new Story({
        author: "author",
        created_at: 33,
        id: 3,
        title: "title 3",
        url: "http://url-to-story.com",
      })
    );
    const second = await gen.next();
    expect(second.value).toStrictEqual(
      new Story({
        author: "author",
        created_at: 22,
        id: 2,
        title: "title 2",
        url: "http://url-to-story.com",
      })
    );

    const third = await gen.next();
    expect(third.value).toStrictEqual(
      new Story({
        author: "author",
        created_at: 11,
        id: 1,
        title: "title 1",
        url: "http://url-to-story.com",
      })
    );
  });

  it("only returns stories, no other items", async () => {
    // @ts-ignore - let us restore this module
    Validator.isValidHackerNewsStory = jest.fn(originalValidator);
    mockGetItem = jest
      .fn()
      .mockResolvedValueOnce({
        id: 3,
        type: "poll",
      })
      .mockResolvedValueOnce({
        id: 2,
        type: "comment",
      })
      .mockResolvedValueOnce({
        by: "author",
        time: 11,
        id: 1,
        title: "only returns stories, no other items",
        type: "story",
        url: "http://url-to-story.com",
      });

    const gen = reader.getPreviousStory();
    const next = await gen.next();

    expect(next.value).toStrictEqual(
      new Story({
        author: "author",
        created_at: 11,
        id: 1,
        title: "only returns stories, no other items",
        url: "http://url-to-story.com",
      })
    );
  });

  it("skips the item's ID on ItemNotFoundError", async () => {
    mockGetLatest = jest.fn().mockResolvedValue(9);
    mockGetItem = jest
      .fn()
      .mockRejectedValueOnce(new ItemNotFoundError(`unable to find item ${9}`))
      .mockRejectedValueOnce(new ItemNotFoundError(`unable to find item ${8}`))
      .mockResolvedValueOnce({
        by: "author",
        time: 335,
        id: 7,
        title: "skips the item's ID on ItemNotFoundError",
        type: "story",
        url: "http://url-to-story.com",
      });

    const gen = reader.getPreviousStory();
    const next = await gen.next();

    expect(mockLogService).toBeCalledTimes(2);
    expect(next.value).toStrictEqual(
      new Story({
        author: "author",
        created_at: 335,
        id: 7,
        title: "skips the item's ID on ItemNotFoundError",
        url: "http://url-to-story.com",
      })
    );
  });

  it("stops the generator if there are no more items to load", async () => {
    mockGetLatest = jest.fn().mockResolvedValue(2);
    mockGetItem = jest
      .fn()
      .mockResolvedValueOnce({
        by: "author",
        time: 2,
        id: 2,
        title: "title 2",
        type: "story",
        url: "http://url-to-story.com",
      })
      .mockResolvedValueOnce({
        by: "author",
        time: 1,
        id: 1,
        title: "title 1",
        type: "story",
        url: "http://url-to-story.com",
      })
      .mockRejectedValueOnce(new ItemNotFoundError(`unable to find item ${0}`));

    const gen = reader.getPreviousStory();

    let next = await gen.next();
    expect(next.done).toBe(false);
    // second call, there are more stories to load
    next = await gen.next();
    expect(next.done).toBe(false);
    // last call, there are more stories to load
    next = await gen.next();

    expect(next.done).toBe(true);
  });
});
