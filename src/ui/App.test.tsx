import { waitFor } from "@testing-library/dom";
import { act, render } from "@testing-library/react";
import React from "react";
import { NewsClient } from "../core/NewsClient";
import { NewsReader } from "../core/NewsReader";
import { App } from "./App";

describe("App integration test", () => {
  let newsReader: NewsReader;
  let mockGetItem = jest
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

  let mockGetLatest = jest.fn().mockResolvedValue(3);
  let mockApiClient: NewsClient = {
    getLatestItemId: () => mockGetLatest(),
    getItem: () => mockGetItem(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    newsReader = new NewsReader(mockApiClient);
  });

  it("renders an initial number of stories", async () => {
    expect.assertions(2);
    await act(async () =>
      render(<App initialNumberOfStories={3} reader={newsReader} />)
    );

    await waitFor(() => expect(mockGetItem).toHaveBeenCalledTimes(3));

    const storyList = document.querySelector(".hn-reader ul");
    const storiesRender = storyList?.childElementCount;
    expect(storiesRender).toBe(3);
  });

  it("renders a story with title, url, author, time", async () => {
    expect.assertions(5);

    mockGetItem = jest.fn().mockResolvedValue({
      by: "Aer Parris",
      time: 1595931102,
      id: 1000,
      title: "How to Create Group Norms",
      type: "story",
      url: "https://doist.com/blog/group-norms-team-communication/",
    });

    await act(async () =>
      render(<App initialNumberOfStories={1} reader={newsReader} />)
    );

    const storyPath = ".hn-reader .hn-story";
    const author = document.querySelector(`${storyPath} .author`);
    const title = document.querySelector(`${storyPath} h1`);
    const link = document.querySelector(`${storyPath} h1 a`);
    const date = document.querySelector(`${storyPath} time`);

    expect(author?.textContent).toBe("Aer Parris");
    expect(title?.textContent).toBe("How to Create Group Norms");
    expect(link?.getAttribute("href")).toBe(
      "https://doist.com/blog/group-norms-team-communication/"
    );
    expect(date?.textContent).toBe("7/28/2020, 8:11:42 PM");
    expect(date?.getAttribute("dateTime")).toBe("2020-07-28T10:11:42.000Z");
  });

  it.todo("show a loading indicator while fetching data");
  it.todo("loads more stories on scroll");
});
