import React, { useEffect, useState } from "react";
import { NewsReader } from "../core/NewsReader";
import { Story } from "../core/Story";
import "./App.css";
import { ErrorMessage } from "./views/ErrorMessage";
import { StoryList } from "./views/StoryList";

interface AppProps {
  initialNumberOfStories: number;
  reader: NewsReader;
}

export function App({ initialNumberOfStories, reader }: AppProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string>();

  async function loadStories(storiesToLoad: number): Promise<void> {
    try {
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
    }
  }

  // Disable the eslint hook so that it doesn't autofix the empty dependency array. We only want this effect to run once, hence the empty array
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(function loadInitialStories() {
    loadStories(initialNumberOfStories);
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className="app">
      <main className="hn-reader">
        <StoryList stories={stories} title={"# Hacker News Story List"} />
      </main>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
