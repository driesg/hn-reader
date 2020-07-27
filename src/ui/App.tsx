import { throttle } from "lodash-es";
import React, { useCallback, useEffect, useState } from "react";
import { NewsReader } from "../core/NewsReader";
import { Story } from "../core/Story";
import "./App.css";
import { ErrorMessage } from "./views/ErrorMessage";
import { StoryList } from "./views/StoryList";

const STORIES_TO_LOAD_ON_SCROLL = 5;
const THROTTLE_WAIT_MS = 300;
const SCROLL_OFFSET = 500;

interface AppProps {
  initialNumberOfStories: number;
  reader: NewsReader;
}

export function App({ initialNumberOfStories, reader }: AppProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const loadStoriesCallback = useCallback(
    async function loadStories(storiesToLoad: number): Promise<void> {
      try {
        setLoading(true);
        const generator = reader.getPreviousStory();

        while (storiesToLoad > 0) {
          const next = await generator.next();
          // break out of the for loop if the generator can't produce results anymore
          if (next.done) {
            // TODO (idea) set a new state value, indication there are no more messages to load
            break;
          }

          const newStory = next.value;
          if (newStory) {
            setStories(function (prevState) {
              return [...prevState, newStory];
            });
            storiesToLoad--;
          }
        }
      } catch (error) {
        console.log(error); // log to reporting service
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [reader]
  );

  // Disable the eslint hook so that it doesn't autofix the empty dependency array. We only want this effect to run once, hence the empty array
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(function loadInitialStories() {
    loadStoriesCallback(initialNumberOfStories);
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  /*
   * We want to load more stories when the user scrolls to the bottom of the
   * page. Rather than waiting until the user has reached the bottom, we will
   * start loading more stories when the user reaches a certain distance
   * (SCROLL_OFFSET) from the bottom.
   *
   * The scroll listener is throttled to ensure that the function only gets
   * invoked max once per every THROTTLE_WAIT_MS milliseconds.
   *
   * We bail early if the app is already loading stories.
   *
   * Given that it can take a while for an application to receive new stories,
   * we immediately load a number (STORIES_TO_LOAD_ON_SCROLL) of additional
   * stories.
   *
   * TODO (idea) rather than a fixed offset, we could calculate it based on the
   * height of the stories. Trying to ensure there are always a certain amount
   * of stories "below the fold"
   */
  useEffect(() => {
    const onScroll = throttle(function loadMoreOnScroll(): void {
      // our app is already loading data. Don't load any extra
      if (loading) {
        return;
      }
      // calculate the distance from the bottom of the page
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = document.documentElement.scrollTop;
      const distanceToBottom =
        documentHeight - scrollPosition - window.innerHeight;

      // if distance from the bottom is less than the offset, load extra stories
      if (distanceToBottom < SCROLL_OFFSET) {
        loadStoriesCallback(STORIES_TO_LOAD_ON_SCROLL);
      }
    }, THROTTLE_WAIT_MS);
    window.addEventListener("scroll", onScroll);

    return () => {
      onScroll.cancel();
      window.removeEventListener("scroll", onScroll);
    };
  }, [loadStoriesCallback, loading]);

  return (
    <div className="app">
      <main className="hn-reader">
        {loading && <p className="loading-indicator">loading stories...</p>}
        <StoryList stories={stories} title={"# Hacker News Story List"} />
      </main>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
