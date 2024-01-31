export interface PaginationMetadata {
  items_count?: number;
  cursor: string;
  hasMore: boolean;
}

export interface Pagination<T extends Array<unknown> | Record<string, unknown>> extends PaginationMetadata {
  items: T;
}
