import {
  CountResponse,
  IndicesGetResponse,
  IndicesGetSettingsRequest,
  IndicesGetSettingsResponse,
  QueryDslBoolQuery,
  QueryDslQueryContainer,
  SearchHitsMetadata,
  UpdateRequest,
  UpdateResponse,
  WriteResponseBase
} from '@elastic/elasticsearch/lib/api/types';
import { DeleteByQueryResponse } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { from, map, Observable, switchMap } from 'rxjs';
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
  public createIndexWithProvidedOptions(): Observable<IndicesGetResponse> {
    const { createIndexSettings, propertiesMappings } = this.metadata;
    return this.didIndexExists().pipe(
      switchMap((exists) => {
        if (exists) {
          return from(
            this.client.indices.get({
              index: this.indexName
            })
          );
        }
        return from(
          this.client.indices.create({
            ...createIndexSettings,
            index: this.indexName,
            mappings: {
              ...createIndexSettings?.mappings,
              properties: propertiesMappings
            }
          })
        ).pipe(
          switchMap((index) =>
            from(
              this.client.indices.get({
                index: index.index
              })
            )
          )
        );
      })
    );
  }

  public findUniqueValue<K extends keyof T>(
    field: K,
    uniqueValue: string | number,
    searchOptions: SearchOptions = {}
  ): Observable<T | null> {
    return from(
      this.client.search<T>({
        ...searchOptions,
        index: this.indexName,
        query: this._getUniqueValueQuery(field, uniqueValue)
      })
    ).pipe(
      map(
        ({ hits }) =>
          hits.hits.filter(
            (hit) => hit._source && hit._source[field] === (uniqueValue as unknown)
          )[0]._source || null
      )
    );
  }

  public findAll(options: SearchOptions = {}): Observable<T[]> {
    return from(
      this.client.search<T>({
        ...options,
        index: this.indexName,
        query: {
          match_all: {}
        }
      })
    ).pipe(map(({ hits }) => this._hitsMetadataToDocumentData(hits)));
  }

  public findByElasticIds(
    elasticIds: string[],
    queryOptions: Omit<QueryDslBoolQuery, 'filter'> = {},
    options: SearchOptions = {}
  ): Observable<T[]> {
    return from(
      this.boolQuerySearch(
        {
          ...queryOptions,
          filter: {
            ids: {
              values: elasticIds
            }
          }
        },
        options
      )
    ).pipe(map(({ hits }) => this._hitsMetadataToDocumentData(hits)));
  }

  public create(
    data: DeepPartial<T>,
    options: IndexOptions = {}
  ): Observable<{ elasticId: string }> {
    return from(
      this.client.index({
        ...options,
        index: this.indexName,
        document: data
      })
    ).pipe(
      map(({ _id }) => ({
        elasticId: _id
      }))
    );
  }

  public createMany(
    data: DeepPartial<T>[],
    options: IndexManyOptions = {}
  ): Observable<
    Array<
      DeepPartial<T> & {
        elasticId: string;
      }
    >
  > {
    const operations = data.flatMap((doc) => [{ index: { _index: this.indexName } }, doc]);
    return from(
      this.client.bulk({
        ...options,
        operations
      })
    ).pipe(
      map(({ items }) => {
        return items.map(({ index }, idx) => ({
          elasticId: index?._id as string,
          ...data[idx]
        }));
      })
    );
  }

  public updateByElasticId(
    id: string,
    dataToUpdate: DeepPartial<T>,
    updateOptions: Omit<UpdateRequest<T>, 'id' | 'index' | 'doc'> = {}
  ): Observable<UpdateResponse<DeepPartial<T>>> {
    return from(
      this.client.update({
        ...updateOptions,
        id,
        index: this.indexName,
        doc: dataToUpdate
      })
    ) as Observable<UpdateResponse<DeepPartial<T>>>;
  }

  public deleteUnique<K extends keyof T>(
    field: K,
    id: string | number
  ): Observable<DeleteByQueryResponse> {
    return from(
      this.client.deleteByQuery({
        index: this.indexName,
        query: this._getUniqueValueQuery(field, id)
      })
    );
  }

  public deleteByElasticId(
    elasticId: string,
    options: DeleteOptions = {}
  ): Observable<WriteResponseBase> {
    return from(
      this.client.delete({
        ...options,
        id: elasticId,
        index: this.indexName
      })
    );
  }

  public deleteAll(): Observable<DeleteByQueryResponse> {
    return from(
      this.client.deleteByQuery({
        index: this.indexName,
        body: {
          query: {
            match_all: {}
          }
        }
      })
    );
  }

  public countDocuments(options: CountOptions = {}): Observable<CountResponse> {
    return from(
      this.client.count({
        ...options,
        index: this.indexName
      })
    );
  }

  private _hitsMetadataToDocumentData(hits: SearchHitsMetadata<T>): T[] {
    return hits.hits.map((hit) => hit._source).filter(Boolean) as T[];
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

  public getIndexSettings(
    options: Omit<IndicesGetSettingsRequest, 'index'> = {}
  ): Observable<IndicesGetSettingsResponse> {
    return from(this.client.indices.getSettings({ ...options, index: this.indexName }));
  }

  public didIndexExists(): Observable<boolean> {
    return from(this.client.indices.exists({ index: this.indexName }));
  }
}
