/**
 * See https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
 */

export class FetchError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "FetchError";
    Object.setPrototypeOf(this, FetchError.prototype);
  }
}
