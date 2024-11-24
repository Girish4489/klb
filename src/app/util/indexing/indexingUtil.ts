interface Index<T> {
  [key: string]: T[];
}

export class LocalIndexer<T> {
  private index: Index<T> = {};

  constructor(private keyExtractor: (item: T) => string) {}

  add(item: T): void {
    const key = this.keyExtractor(item);
    if (!this.index[key]) {
      this.index[key] = [];
    }
    this.index[key].push(item);
  }

  search(key: string): T[] {
    return this.index[key] || [];
  }

  clear(): void {
    this.index = {};
  }
}
