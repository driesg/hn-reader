import { HNApiResponse } from "../adapters/hackernews/HackerNewsClient";
import { isValidHackerNewsStory } from "../adapters/hackernews/isValidHackerNewsStory";
import { NewsClient } from "./NewsClient";
import { Story } from "./Story";
import { FetchError } from "./utils/FetchError";
import { ItemNotFoundError } from "./utils/ItemNotFoundError";

type ClientResponse = HNApiResponse;

export class NewsReader {
  private client: NewsClient;
  private nextItemId?: number;

  constructor(client: NewsClient) {
    this.client = client;
    this.nextItemId = undefined;
  }

  /**
   * Method to get the next id to load.
   *
   * When the instance nextItemId property is undefined, we get the latest item id
   * from the api, otherwise we just decrease by 1
   *
   * This method is only suitable to use by getPreviousStory but can easily be extended by
   * passing in and Order (Ascending|Descending) parameter
   *
   * @returns {Promise<number>} the next id to load
   */
  private async getNextIdToLoad(): Promise<number> {
    const nextId: number = this.nextItemId
      ? this.nextItemId - 1
      : await this.client.getLatestItemId();

    return nextId;
  }

  /**
   * Method to create an AsyncGenerator which loads stories from the API
   *
   * @returns an AsyncGenerator
   */
  /*
   * Design Choices:
   * ===============
   *
   * 1) Using a Generator
   * --------------------
   * We use a generator as a data producer (Iterator).
   * The method below will return return a generator object (wrapped in a promise)
   * that can be used to control the data producer.
   *
   * Using a generator allows us to pause & resume the "data production" of new stories.
   *
   * The generator is an async generator since we're making network requests in its body.
   *
   * More info on Generators https://exploringjs.com/es6/ch_generators.html
   *
   * 2) do while
   * -----------
   * Note that our generator will only yield (pause and send a result) when we get a valid
   * story from the API. The API we use is limited, it returns both invalid story data and
   * other data objects like comments or polls.
   *
   * Using a loop inside the generator's body allows us to keep making network requests
   * until we receive a value that satisfies our demands.
   *
   * !! ASSUMPTION
   * Our loop will run until we reach the last possible id. Given that the type of the
   * id is a number, we assume the last possible id is `1`.
   * See also https://hacker-news.firebaseio.com/v0/item/0.json (returns null)
   * This assumption is based on the HN API and doesn't scale.
   *
   * After yielding the last Story, the generator will return {value: story, done: true}
   * to indicate there is no more data to generate
   *
   * We've opted for a do while since we want to run through at least 1 iteration and
   * it allows us to encapsulate all network calls a single try catch.
   *
   * 2) `try catch` inside `do while`
   * --------------------------------
   * We're using a try catch statement to catch any errors that might happen during the
   * execution of our generator. When a ItemNotFoundError happens, we don't want to do
   * anything (except maybe log it). We want to move on and get the next story.
   * Other are thrown up to the caller of the generator
   *
   * The try catch is located INSIDE the loop, this ensures that the loop does not
   * break when an error is thrown.
   *
   */
  async *getPreviousStory(): AsyncGenerator<Story, void, unknown> {
    do {
      try {
        let story: Story;
        this.nextItemId = await this.getNextIdToLoad();
        const item: ClientResponse = await this.client.getItem(this.nextItemId);

        // We only care about valid stories, discard all other items received
        if (this.isValidStory(item)) {
          story = new Story({
            ...item,
            author: item.by,
            created_at: item.time,
          });

          yield story;
        }
      } catch (error) {
        // Handle the case where we have a successful response but no item was returned.
        // In a production app, this could be logging to a reporting service.
        if (error instanceof ItemNotFoundError) {
          console.warn(
            `item with id ${this.nextItemId} was not found, skipping`
          );
        } else if (error instanceof FetchError) {
          console.log(error);
          throw error;
        } else {
          // Any other error we throw further up so it can be handled by the consumer of this method
          console.log(
            `${error.name}: "${error.message}" while trying to get ${this.nextItemId}`
          );
          throw error;
        }
      }
    } while (this.nextItemId && this.nextItemId > 1); // just in case we make it all the way to the start
  }

  /**
   * validate the API response to ensure no unexpected type errors occur
   * @param story a story like object
   * @returns {boolean} returns true if it's a valid story
   */
  private isValidStory(story: ClientResponse) {
    return isValidHackerNewsStory(story);
  }
}
