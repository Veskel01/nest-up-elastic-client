import { MappingProperty } from '@elastic/elasticsearch/lib/api/types';
import { ElasticDocumentClass } from './elastic-document.type';

export type ElasticDocumentProperty = MappingProperty | string;

export type ElasticDocumentPropertyMetadata = {
  propertyName: string;
  target: ElasticDocumentClass;
  options: ElasticDocumentProperty;
};

export type PlainElasticDocumentPropertyMetadata = Omit<ElasticDocumentPropertyMetadata, 'target'>;
