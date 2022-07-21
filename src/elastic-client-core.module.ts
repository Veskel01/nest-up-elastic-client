import { ModuleRef } from '@nestjs/core';
import { Client, ClientOptions } from '@elastic/elasticsearch';
import {
  ConfigurableModuleAsyncOptions,
  DynamicModule,
  Inject,
  Logger,
  Module,
  OnApplicationShutdown
} from '@nestjs/common';
import { DEFAULT_CLIENT_NAME } from './constants';
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from './module.declaration';
import { getElasticClientToken } from './injection-tokens';
import {
  CustomElasticRepositoryClass,
  ElasticClientModuleExtras,
  ElasticDocumentClass
} from './types';
import { createElasticProviders } from './create-elastic.providers';

@Module({})
export class ElasticClientCoreModule
  extends ConfigurableModuleClass
  implements OnApplicationShutdown
{
  private readonly _logger: Logger = new Logger(ElasticClientCoreModule.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly clientOptions: ClientOptions & ElasticClientModuleExtras,
    private readonly moduleRef: ModuleRef
  ) {
    super();
  }

  public static forRoot(options: ClientOptions & ElasticClientModuleExtras): DynamicModule {
    return super.forRoot(options);
  }

  public static forRootAsync(
    options: ConfigurableModuleAsyncOptions<ClientOptions, 'createElasticsearchModuleOptions'> &
      ElasticClientModuleExtras
  ): DynamicModule {
    return super.forRootAsync(options);
  }

  /**
   * @param options.documents - array of documents to be registered
   * @param options.customRepositories - array of custom repositories to be registered
   * @param options.clientName - name of the client
   * @description - Creates providers for every elastic document provider in the array
   */
  public static forFeature({
    documents,
    customRepositories = [],
    clientName = DEFAULT_CLIENT_NAME
  }: {
    documents: ElasticDocumentClass[];
    customRepositories?: CustomElasticRepositoryClass[];
    clientName?: string;
  }): DynamicModule {
    const providers = createElasticProviders(documents, customRepositories, clientName);
    return {
      module: ElasticClientCoreModule,
      providers,
      exports: providers
    };
  }

  async onApplicationShutdown(): Promise<void> {
    const elasticClient = this.moduleRef.get<Client>(
      getElasticClientToken(this.clientOptions.clientName),
      { strict: false }
    );
    const { connections } = elasticClient.connectionPool;
    if (connections.length > 0) {
      try {
        await elasticClient.close();
      } catch (err) {
        this._logger.error(err?.message);
      }
    }
  }
}
