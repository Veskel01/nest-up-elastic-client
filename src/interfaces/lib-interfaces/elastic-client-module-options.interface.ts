import { ClientOptions } from '@elastic/elasticsearch';
import { FACTORY_METHOD_NAME } from '../../constants';
import { ElasticDocumentType } from './elastic-document.type';

export type ElasticClientModuleExtras = {
  clientName?: string;
};

export type ElasticClientModuleOptions = ClientOptions;

export interface ElasticClientModuleOptionsFactory {
  [FACTORY_METHOD_NAME](): Promise<ElasticClientModuleOptions> | ElasticClientModuleOptions;
}

export interface ForFeatureOptions {
  documents?: ElasticDocumentType[];
  clientName?: string;
}
