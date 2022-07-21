import { DEFAULT_CLIENT_NAME } from './constants';
import { ElasticDocumentClass } from './types';

export const getElasticClientToken = (clientName: string = DEFAULT_CLIENT_NAME): string =>
  `${clientName}_elastic_client`;

export const getElasticRepositoryToken = (document: ElasticDocumentClass): string =>
  `${document}_elastic_repository`;

export const getDocumentMetadataToken = (document: ElasticDocumentClass): string =>
  `${document.name}_elastic_document_metadata`;
