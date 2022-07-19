import { TransportRequestOptionsWithOutMeta } from '@elastic/elasticsearch';
import { IndicesCreateRequest } from '@elastic/elasticsearch/lib/api/types';
import { DeepOmit } from '../util.types';

export type CreateIndexType = DeepOmit<IndicesCreateRequest, 'index' | 'properties'>;

export type ElasticDocumentOptionsWithoutJson = {
  indexName: string;
  createOnInit?: boolean;
  settingsType: 'object-settings';
  indexOptions?: CreateIndexType;
  transportOptions?: TransportRequestOptionsWithOutMeta;
};

export type ElasticDocumentOptionsWithJson = {
  indexName: string;
  createOnInit?: boolean;
  settingsType: 'json';
  settingsJsonFilePath: string;
};

export type ElasticDocumentOptions =
  | ElasticDocumentOptionsWithoutJson
  | ElasticDocumentOptionsWithJson;
