import { HackerNewsClient, ItemNotFoundError } from "./HackerNewsClient";
import { Story } from "../../core/Story";

const testUrl = "http://fake-hacker-news-base-url";

describe("HackerNewsClient", () => {
  let apiClient: HackerNewsClient;

  beforeAll(() => {
    apiClient = new HackerNewsClient(testUrl);
  });

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe("error handling", () => {
    it("throws an error when the request fails", async () => {
      fetchMock.mockRejectOnce(new Error("fake error message"));

      await expect(apiClient.getLatestItemId()).rejects.toThrow(
        "fake error message"
      );
    });

    it("throws an error when the request aborts", async () => {
      fetchMock.mockAbortOnce();

      await expect(apiClient.getLatestItemId()).rejects.toThrow(
        "The operation was aborted."
      );
    });
  });

  describe("methods", () => {
    describe("getLatestItemId", () => {
      it("calls the HN maxitem endpoint and returns the latest item's id", async () => {
        fetchMock.mockResponse(JSON.stringify(5));

        const latestId = await apiClient.getLatestItemId();

        expect(fetchMock.mock.calls[0][0]).toEqual(
          "http://fake-hacker-news-base-url/maxitem.json"
        );
        expect(latestId).toBe(5);
      });
    });

    describe("getItem", () => {
      it("throws an itemNotFoundError when receiving null as response", async () => {
        fetchMock.mockResponse(JSON.stringify(null));
        await expect(apiClient.getItem(8863)).rejects.toThrow(
          ItemNotFoundError
        );
        await expect(
          apiClient.getItem(8863)
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"Unable to load item 8863"`
        );
      });

      it("calls the HN item endpoint and returns the specified item", async () => {
        const mockItem = {
          by: "dhouston",
          descendants: 71,
          id: 8863,
          kids: [9224],
          score: 104,
          time: 1175714200,
          title: "My YC app: Dropbox - Throw away your USB drive",
          type: "story",
          url: "http://www.getdropbox.com/u/2/screencast.html",
        };

        fetchMock.mockResponse(JSON.stringify(mockItem));

        const item = await apiClient.getItem<Story>(8863);

        expect(fetchMock.mock.calls[0][0]).toEqual(
          "http://fake-hacker-news-base-url/item/8863.json"
        );
        expect(item).toStrictEqual(mockItem);
      });
    });
  });
});
