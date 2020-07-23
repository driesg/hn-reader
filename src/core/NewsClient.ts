export interface NewsClient {
  getItem<ItemType>(itemId: number): Promise<ItemType>;
  getLatestItemId(): Promise<number>;
}
