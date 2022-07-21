import { ElasticDocumentOptions } from './elastic-document-options.type';
import { PlainElasticDocumentPropertyMetadata } from './elastic-document-property.type';

export interface ElasticDocumentMetadata {
  documentOptions: ElasticDocumentOptions;
  propertiesMetadata: PlainElasticDocumentPropertyMetadata[];
}
