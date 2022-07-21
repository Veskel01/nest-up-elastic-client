import { MappingProperty } from '@elastic/elasticsearch/lib/api/types';
import { CreateIndexType, SynchronizeIndexSettings } from './elastic-document-options.type';

export interface ElasticDocumentMetadata {
  indexName: string;
  createOnInit: boolean;
  synchronize: boolean;
  createIndexSettings: CreateIndexType;
  synchronizeSettings: SynchronizeIndexSettings;
  propertiesMappings: Record<string, MappingProperty>;
}
