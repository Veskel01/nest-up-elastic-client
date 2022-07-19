import { ElasticDocumentOptions } from '../lib-interfaces';
import { DocumentPropertyMetadataWithoutTarget } from './document-property-metadata.interface';

export interface DocumentMetadata {
  documentOptions: ElasticDocumentOptions;
  propertiesMetadata: DocumentPropertyMetadataWithoutTarget[];
}
