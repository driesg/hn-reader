import * as React from "react";
import { Story } from "./Story";
import "./StoryList.css";

export interface IStoryListProps {}

export function StoryList(props: IStoryListProps) {
  return (
    <ul className="story-list">
      {[...Array(115)].map((e, idx) => (
        <li key={idx}>
          <Story />
        </li>
      ))}
    </ul>
  );
}
