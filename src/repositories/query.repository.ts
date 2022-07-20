import { Client } from '@elastic/elasticsearch';
import {
  QueryDslMatchQuery,
  QueryDslMultiMatchQuery,
  SearchResponse
} from '@elastic/elasticsearch/lib/api/types';
import { ElasticDocumentMetadata } from '../types';
import { SearchOptions } from '../types/elastic-repository.types';

export class QueryRepository<T> {
  protected readonly indexName: string;

  constructor(
    public readonly client: Client,
    protected readonly metadata: ElasticDocumentMetadata
  ) {
    this.indexName = metadata.documentOptions.indexName;
  }

  public matchQuerySearch<K extends keyof T>(
    key: K,
    value: string | number | boolean,
    queryOptions: Omit<QueryDslMatchQuery, 'query'> = {},
    options: SearchOptions = {}
  ): Promise<SearchResponse<T>> {
    return this.client.search({
      ...options,
      index: this.indexName,
      query: {
        ...queryOptions,
        match: {
          [key]: value
        }
      }
    });
  }

  public multiMatchQuerySearch<K extends keyof T>(
    keys: K[],
    query: string,
    queryOptions: Omit<QueryDslMultiMatchQuery, 'query' | 'fields'> = {},
    options: SearchOptions = {}
  ): Promise<SearchResponse<T>> {
    return this.client.search({
      ...options,
      index: this.indexName,
      query: {
        multi_match: {
          ...queryOptions,
          query,
          fields: keys as string[]
        }
      }
    });
  }
}
