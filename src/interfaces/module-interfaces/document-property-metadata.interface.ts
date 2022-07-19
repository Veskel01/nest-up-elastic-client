import { DocumentFieldOptions } from '../lib-interfaces';

export interface DocumentPropertyMetadata {
  name: string;
  target: Function;
  options: DocumentFieldOptions;
}

export type DocumentPropertyMetadataWithoutTarget = Omit<DocumentPropertyMetadata, 'target'>;
