import { Story } from "../../core/Story";
import { ItemNotFoundError } from "../../core/utils/ItemNotFoundError";
import { HackerNewsClient } from "./HackerNewsClient";

const testUrl = "http://fake-hacker-news-base-url";

const init404 = {
  status: 404,
  statusText: "Not Found",
};

const init500 = {
  status: 500,
  statusText: "Internal Server Error",
};

const init401 = {
  status: 401,
  statusText: "Unauthorized",
};

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
      fetchMock.mockRejectOnce();

      await expect(apiClient.getLatestItemId()).rejects.toThrow(
        "fetch failed for http://fake-hacker-news-base-url/maxitem.json"
      );
    });

    it("throws an error when receiving a client error response", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ error: "Permission denied" }),
        init401
      );

      await expect(apiClient.getLatestItemId()).rejects.toThrow(
        "Error 401 Unauthorized"
      );

      fetchMock.mockResponseOnce(
        JSON.stringify({ error: "Resource not found" }),
        init404
      );

      await expect(apiClient.getLatestItemId()).rejects.toThrow(
        "Error 404 Not Found"
      );
    });

    it("throws an error when receiving a server error response", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ error: "Server is broken" }),
        init500
      );

      await expect(apiClient.getLatestItemId()).rejects.toThrow(
        "Error 500 Internal Server Error"
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
