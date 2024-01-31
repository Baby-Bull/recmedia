import { PaginationMetadata } from "./Pagination";

export interface OneRelationship<Key = string> {
  id: Key;
}

export interface ManyRelationship<Key = string> {
  ids: Key[];
}

export interface PaginatedRelationship<Key = string> extends ManyRelationship<Key>, PaginationMetadata {}
