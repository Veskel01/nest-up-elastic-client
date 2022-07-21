import { ClientOptions } from '@elastic/elasticsearch';

export type ElasticClientModuleExtras = {
  clientName?: string;
};

export type ElasticClientModuleOptions = ClientOptions;

export type ElasticClientFactoryOptions = ElasticClientModuleOptions & ElasticClientModuleExtras;

export interface ElasticClientOptionsFactory {
  createElasticsearchModuleOptions():
    | ElasticClientFactoryOptions
    | Promise<ElasticClientFactoryOptions>;
}
