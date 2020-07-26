export enum DateTimeFormat {
  Locale,
  ISO,
}

export class Story {
  readonly author: string;
  readonly created_at: number;
  readonly id: number;
  readonly title: string;
  readonly url: string;

  constructor(params: any) {
    this.author = params.author;
    this.created_at = params.created_at;
    this.id = params.id;
    this.title = params.title;
    this.url = params.url;
  }

  /**
   * Get the `created_at` date & time of a story as a human or machine readable string.
   * The human readable string will be formatted using the device's locale
   *
   * @param format {DateTimeFormat} requested format (`Locale` or `ISO`), defaults to locale
   * @returns {string} The story's created_at in the requested format
   */
  getCreatedAtDate(format: DateTimeFormat = DateTimeFormat.Locale): string {
    const date = new Date(this.created_at * 1000);

    if (format === DateTimeFormat.ISO) {
      return date.toISOString();
    }
    return date.toLocaleString();
  }
}
