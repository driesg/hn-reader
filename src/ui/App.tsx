import React from "react";
import { StoryList } from "./views/StoryList";
import "./App.css";

export function App() {
  return (
    <div className="app">
      <main className="hn-reader">
        <StoryList stories={stories} title={"# Hacker News Story List"} />
      </main>
    </div>
  );
}
