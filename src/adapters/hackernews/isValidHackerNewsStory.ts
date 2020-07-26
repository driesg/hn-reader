import { Story } from "../../core/Story";
import { HNItem } from "./HackerNewsClient";
/**
 * Guard to ensure we receive a valid Story from the HN API.
 * It seems API responses can be missing one or more of the fields below.
 *
 * We also exclude any dead or deleted items
 * // TODO document this assumption
 *
 * @param response response received from the HN API
 */

export function isValidHackerNewsStory(response: HNItem): response is Story {
  return (
    !response.dead &&
    !response.deleted &&
    response.type === "story" &&
    response.by !== undefined &&
    response.time !== undefined &&
    response.title !== undefined &&
    response.url !== undefined
  );
}
