import {
  BulkResponse,
  CountResponse,
  SearchResponse,
  WriteResponseBase
} from '@elastic/elasticsearch/lib/api/types';
import {
  CountOptions,
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

  public findAll(options: SearchOptions = {}): Promise<SearchResponse<T>> {
    return this.client.search<T>({
      ...options,
      index: this.indexName,
      query: {
        match_all: {}
      }
    });
  }

  public count(options: CountOptions = {}): Promise<CountResponse> {
    return this.client.count({
      ...options,
      index: this.indexName
    });
  }
}
