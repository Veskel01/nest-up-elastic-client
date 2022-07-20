import {
  BulkResponse,
  CountResponse,
  QueryDslBoolQuery,
  QueryDslQueryContainer,
  SearchResponse,
  UpdateRequest,
  UpdateResponse,
  WriteResponseBase
} from '@elastic/elasticsearch/lib/api/types';
import { DeleteByQueryResponse } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import {
  CountOptions,
  DeleteOptions,
  IndexManyOptions,
  IndexOptions,
  SearchOptions
} from '../types/elastic-repository.types';
import { DeepPartial } from '../types/util.types';
import { QueryRepository } from './query.repository';

export class ElasticRepository<T> extends QueryRepository<T> {
  public index(data: DeepPartial<T>, options: IndexOptions = {}): Promise<WriteResponseBase> {
    return this.client.index({
      ...options,
      index: this.indexName,
      document: data
    });
  }

  public indexMany(data: DeepPartial<T>[], options: IndexManyOptions = {}): Promise<BulkResponse> {
    const operations = data.flatMap((doc) => [{ index: { _index: this.indexName } }, doc]);
    return this.client.bulk({
      ...options,
      index: this.indexName,
      operations
    });
  }

  public async findUniqueValue<K extends keyof T>(
    field: K,
    id: string | number,
    searchOptions: SearchOptions = {}
  ): Promise<SearchResponse<T>> {
    const searchResult = await this.client.search<T>({
      ...searchOptions,
      index: this.indexName,
      query: this._getUniqueValueQuery(field, id)
    });
    return {
      ...searchResult,
      hits: {
        ...searchResult.hits,
        hits: searchResult.hits.hits.filter(
          (hit) => hit._source && hit._source[field] === (id as unknown)
        )
      }
    };
  }

  public findAll(options: SearchOptions = {}): Promise<SearchResponse<T>> {
    return this.client.search<T>({
      ...options,
      index: this.indexName,
      query: {
        match_all: {}
      }
    });
  }

  public findByElasticIds(
    elasticIds: string[],
    queryOptions: Omit<QueryDslBoolQuery, 'filter'> = {},
    options: SearchOptions = {}
  ): Promise<SearchResponse<T>> {
    return this.boolQuerySearch(
      {
        ...queryOptions,
        filter: {
          ids: {
            values: elasticIds
          }
        }
      },
      options
    );
  }

  public updateByElasticId(
    id: string,
    dataToUpdate: DeepPartial<T>,
    updateOptions: Omit<UpdateRequest<T>, 'id' | 'index' | 'doc'> = {}
  ): Promise<UpdateResponse<DeepPartial<T>>> {
    return this.client.update({
      ...updateOptions,
      id,
      index: this.indexName,
      doc: dataToUpdate
    });
  }

  public deleteUnique<K extends keyof T>(
    field: K,
    id: string | number
  ): Promise<DeleteByQueryResponse> {
    return this.client.deleteByQuery({
      index: this.indexName,
      query: this._getUniqueValueQuery(field, id)
    });
  }

  public deleteByElasticId(
    elasticId: string,
    options: DeleteOptions = {}
  ): Promise<WriteResponseBase> {
    return this.client.delete({
      ...options,
      id: elasticId,
      index: this.indexName
    });
  }

  public deleteAll(): Promise<DeleteByQueryResponse> {
    return this.client.deleteByQuery({
      index: this.indexName,
      body: {
        query: {
          match_all: {}
        }
      }
    });
  }

  public countDocuments(options: CountOptions = {}): Promise<CountResponse> {
    return this.client.count({
      ...options,
      index: this.indexName
    });
  }
  private _getUniqueValueQuery<K extends keyof T>(
    field: K,
    uniqueValue: string | number
  ): QueryDslQueryContainer {
    return {
      match_phrase: {
        [field]: uniqueValue.toString()
      }
    };
  }
}
