import React from "react";
import ReactDOM from "react-dom";
import { HackerNewsClient } from "./adapters/hackernews/HackerNewsClient";
import { NewsReader } from "./core/NewsReader";
import * as serviceWorker from "./serviceWorker";
import { App } from "./ui/App";
import { ErrorBoundary } from "./ui/views/ErrorBoundary";

const INITIAL_NUMBER_OF_STORIES: number = 30;
const hnClient = new HackerNewsClient("https://hacker-news.firebaseio.com/v0");
const newsReader = new NewsReader(hnClient);

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App
        initialNumberOfStories={INITIAL_NUMBER_OF_STORIES}
        reader={newsReader}
      />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
