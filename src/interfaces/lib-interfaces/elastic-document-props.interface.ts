import { DocumentPropertyMetadataWithoutTarget } from '../module-interfaces';

export interface ElasticDocumentProps<T> {
  indexName: string;
  documentProperties: Record<keyof T, DocumentPropertyMetadataWithoutTarget['options']>;
}
