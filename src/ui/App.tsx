import React from "react";
import { StoryList } from "./views/StoryList";
import "./App.css";

export function App() {
  return (
    <div className="app">
      <main className="hn-reader">
        <h1># Hacker News Story List:</h1>
        <StoryList />
      </main>
    </div>
  );
}
