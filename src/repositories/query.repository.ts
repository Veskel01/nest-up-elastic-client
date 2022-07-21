import { Client } from '@elastic/elasticsearch';
import {
  QueryDslBoolQuery,
  QueryDslConstantScoreQuery,
  QueryDslMatchQuery,
  QueryDslMultiMatchQuery,
  SearchResponse
} from '@elastic/elasticsearch/lib/api/types';
import { from, Observable } from 'rxjs';
import { ElasticDocumentMetadata } from '../types';
import { SearchOptions } from '../types/elastic-repository.types';

export class QueryRepository<T> {
  protected readonly indexName: string;

  constructor(
    public readonly client: Client,
    protected readonly metadata: ElasticDocumentMetadata
  ) {
    this.indexName = metadata.indexName;
  }

  public boolQuerySearch(
    queryOptions: QueryDslBoolQuery = {},
    options: SearchOptions = {}
  ): Observable<SearchResponse<T>> {
    return from(
      this.client.search<T>({
        ...options,
        index: this.indexName,
        query: {
          bool: queryOptions
        }
      })
    );
  }

  public constantScoreSearch(
    queryOptions: QueryDslConstantScoreQuery = {
      filter: {}
    },
    searchOptions: SearchOptions = {}
  ): Observable<SearchResponse<T>> {
    return from(
      this.client.search<T>({
        ...searchOptions,
        index: this.indexName,
        query: {
          constant_score: queryOptions
        }
      })
    );
  }

  public matchQuerySearch<K extends keyof T>(
    key: K,
    value: string | number | boolean,
    queryOptions: Omit<QueryDslMatchQuery, 'query'> = {},
    options: SearchOptions = {}
  ): Observable<SearchResponse<T>> {
    return from(
      this.client.search<T>({
        ...options,
        index: this.indexName,
        query: {
          ...queryOptions,
          match: {
            [key]: value
          }
        }
      })
    );
  }

  public multiMatchQuerySearch<K extends keyof T>(
    keys: K[],
    query: string,
    queryOptions: Omit<QueryDslMultiMatchQuery, 'query' | 'fields'> = {},
    options: SearchOptions = {}
  ): Observable<SearchResponse<T>> {
    return from(
      this.client.search<T>({
        ...options,
        index: this.indexName,
        query: {
          multi_match: {
            ...queryOptions,
            query,
            fields: keys as string[]
          }
        }
      })
    );
  }
}
