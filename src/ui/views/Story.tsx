import * as React from "react";
import "./Story.css";

export interface IStoryProps {}

export function Story(props: IStoryProps) {
  return (
    <article className="hn-story">
      <h1>
        <a href="#">This is the story title</a>
      </h1>
      <footer>
        submitted on <time dateTime="2020-07-29">29 July 2020</time> by{" "}
        <span className="author">Dries</span>
      </footer>
    </article>
  );
}
