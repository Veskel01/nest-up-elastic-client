import { TransportRequestOptionsWithOutMeta } from '@elastic/elasticsearch';
import { IndicesCreateRequest } from '@elastic/elasticsearch/lib/api/types';
import { DeepOmit } from './util.types';

type CreateIndexType = DeepOmit<IndicesCreateRequest, 'index' | 'properties'>;

type ElasticDocumentOptionsWithoutJson = {
  indexName: string;
  createOnInit?: boolean;
  type: 'object-settings';
  indexOptions?: CreateIndexType;
  transportOptions?: TransportRequestOptionsWithOutMeta;
};

type ElasticDocumentOptionsWithJson = {
  indexName: string;
  createOnInit?: boolean;
  type: 'json';
  settingsJsonFilePath: string;
};

export type ElasticDocumentOptions =
  | ElasticDocumentOptionsWithoutJson
  | ElasticDocumentOptionsWithJson;
