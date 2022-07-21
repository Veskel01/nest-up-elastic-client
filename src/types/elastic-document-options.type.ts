import {
  IndicesCreateRequest,
  IndicesPutSettingsRequest,
  MappingTypeMapping
} from '@elastic/elasticsearch/lib/api/types';
import { DeepOmit } from './util.types';

export type CreateIndexType = DeepOmit<
  IndicesCreateRequest,
  'index' | 'properties' | 'mappings'
> & {
  mappings?: MappingTypeMapping;
};

export type SynchronizeIndexSettings = Omit<IndicesPutSettingsRequest, 'index'>;

export type ElasticDocumentOptionsWithoutJson = {
  indexName: string;
  createOnInit?: boolean;
  type: 'object-settings';
  synchronize?: boolean;
  createIndexSettings?: CreateIndexType;
  synchronizeSettings?: SynchronizeIndexSettings;
};

export type ElasticDocumentOptionsWithJson = {
  indexName: string;
  createOnInit?: boolean;
  type: 'json';
  synchronize?: boolean;
  settingsJsonFilePath: string;
  synchronizeSettings?: SynchronizeIndexSettings;
};

export type ElasticDocumentOptions =
  | ElasticDocumentOptionsWithoutJson
  | ElasticDocumentOptionsWithJson;
