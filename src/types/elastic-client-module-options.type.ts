import { ClientOptions } from '@elastic/elasticsearch';

export type ElasticClientModuleExtras = {
  clientName?: string;
};

export type ElasticClientModuleOptions = ClientOptions;
