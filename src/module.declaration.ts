import { ConfigurableModuleBuilder, Provider } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { CLASS_METHOD_NAME, DEFAULT_CLIENT_NAME, FACTORY_METHOD_NAME } from './constants';
import { ElasticClientModuleExtras, ElasticClientModuleOptions } from './types';
import { getElasticClientToken } from './injection-tokens';

export const { ASYNC_OPTIONS_TYPE, OPTIONS_TYPE, ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ElasticClientModuleOptions>()
    .setClassMethodName(CLASS_METHOD_NAME)
    .setFactoryMethodName(FACTORY_METHOD_NAME)
    .setExtras<ElasticClientModuleExtras>(
      { clientName: DEFAULT_CLIENT_NAME },
      (def, { clientName }) => {
        const elasticClientProvider: Provider<Client> = {
          provide: getElasticClientToken(clientName),
          useFactory: (options: typeof OPTIONS_TYPE): Client => new Client(options),
          inject: [MODULE_OPTIONS_TOKEN]
        };
        return {
          ...def,
          providers: [...(def.providers || []), elasticClientProvider],
          exports: [elasticClientProvider, MODULE_OPTIONS_TOKEN],
          global: true
        };
      }
    )
    .build();
