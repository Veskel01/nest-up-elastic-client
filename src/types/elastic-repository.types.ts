import {
  BulkRequest,
  CountRequest,
  DeleteRequest,
  IndexRequest,
  SearchRequest
} from '@elastic/elasticsearch/lib/api/types';

export type IndexOptions = Omit<IndexRequest, 'index' | 'document'>;
export type IndexManyOptions = Omit<BulkRequest, 'index' | 'operations'>;
export type SearchOptions = Omit<SearchRequest, 'query' | 'index' | 'q'>;
export type DeleteOptions = Omit<DeleteRequest, 'id' | 'index'>;
export type CountOptions = Omit<CountRequest, 'index'>;
