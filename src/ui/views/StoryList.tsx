import React from "react";
import { Story } from "../../core/Story";
import { MemoizedStory as StoryView } from "./Story";
import "./StoryList.css";

export interface StoryListProps {
  stories: Story[];
  title: string;
}

export function StoryList({ stories, title }: StoryListProps) {
  return (
    <React.Fragment>
      <h1 className="story-list-title">{title}</h1>
      <ul className="story-list">
        {stories.map((story) => (
          <li key={story.id}>
            <StoryView story={story} />
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
}
