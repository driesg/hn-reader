import { NewsClient } from "../../core/NewsClient";

/**
 * See https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
 */
export class ItemNotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "ItemNotFoundError";
    Object.setPrototypeOf(this, ItemNotFoundError.prototype);
  }
}

/**
 * HackerNewsClient is a simple wrapper around the HN API.
 * The
 */
export class HackerNewsClient implements NewsClient {
  private baseUrl: string;

  /**
   * Create a new HN API client.
   *
   * @param baseUrl the base URL of the API we want to connect to.
   * eg `https://hacker-news.firebaseio.com/v0`
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * An internal helper function to fetch and parse the response
   *
   * @param path the path of the resource to make the GET call to
   */
  private async getJSON<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/json",
      }),
    });

    if (!response.ok) {
      console.error("request failure", response);
    }

    const result: T = await response.json();
    return result;
  }

  /**
   * Get a Hacker News Item (`job`, `comment`, `story`, `poll`, `pollopt`)
   * by its id
   *
   * @param itemId the id of the item we want to retrieve
   * @returns a Promise that resolves to the HN item (https://github.com/HackerNews/API#items)
   * or throws an `ItemNotFoundError` in case of a 200 response with `null` body
   */
  async getItem<T>(itemId: number): Promise<T> {
    const response = await this.getJSON<T>(`/item/${itemId}.json`);

    /*
     * It appears that the Hacker News API can return `null` for ids. The API
     * will still return a 200 status response.
     * This is undocumented behaviour and could potentially break our app.
     * By throwing a response, we force the consumer of our application to
     * handle the exception
     */
    if (response === null) {
      throw new ItemNotFoundError(`Unable to load item ${itemId}`);
    }
    return response;
  }

  /**
   * Get the most recent items from Hacker News
   *
   * @returns a Promise resolving to the latest item's ID
   */
  async getLatestItemId(): Promise<number> {
    const response = await this.getJSON<number>("/maxitem.json");
    return response;
  }
}
