import React from "react";
import { DateTimeFormat, Story as StoryInterface } from "../../core/Story";
import "./Story.css";

export interface StoryProps {
  story: StoryInterface;
}

export function Story({ story }: StoryProps) {
  return (
    <article className="hn-story">
      <h1>
        <a href={story.url}>{story.title}</a>
      </h1>
      <footer>
        submitted on{" "}
        <time dateTime={story.getCreatedAtDate(DateTimeFormat.ISO)}>
          {story.getCreatedAtDate()}
        </time>{" "}
        by <span className="author">{story.author}</span>
      </footer>
    </article>
  );
}

export const MemoizedStory = React.memo(Story);
