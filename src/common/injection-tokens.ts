import { DEFAULT_CLIENT_NAME } from '../constants';
import { ElasticDocumentType } from '../interfaces/lib-interfaces';

export const getElasticClientToken = (clientName: string = DEFAULT_CLIENT_NAME): string =>
  `${clientName}_elastic_client`;

export const getElasticDocumentPropsToken = (document: ElasticDocumentType): string =>
  `${document.name}_elastic_document_props`;
