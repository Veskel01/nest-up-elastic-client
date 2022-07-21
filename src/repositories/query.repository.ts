import { Client } from '@elastic/elasticsearch';
import {
  QueryDslBoolQuery,
  QueryDslConstantScoreQuery,
  QueryDslMatchQuery,
  QueryDslMultiMatchQuery,
  SearchResponse
} from '@elastic/elasticsearch/lib/api/types';
import { ElasticDocumentMetadata } from '../types';
import { SearchOptions } from '../types/elastic-repository.types';

export class QueryRepository<T> {
  protected readonly indexName: string;

  constructor(public readonly client: Client, public readonly metadata: ElasticDocumentMetadata) {
    this.indexName = metadata.documentOptions.indexName;
  }

  public boolQuerySearch(
    queryOptions: QueryDslBoolQuery = {},
    options: SearchOptions = {}
  ): Promise<SearchResponse<T>> {
    return this.client.search({
      ...options,
      index: this.indexName,
      query: {
        bool: queryOptions
      }
    });
  }

  public constantScoreSearch(
    queryOptions: QueryDslConstantScoreQuery = {
      filter: {}
    },
    searchOptions: SearchOptions = {}
  ): Promise<SearchResponse<T>> {
    return this.client.search({
      ...searchOptions,
      index: this.indexName,
      query: {
        constant_score: queryOptions
      }
    });
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
