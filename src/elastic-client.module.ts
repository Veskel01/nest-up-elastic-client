import { ModuleRef } from '@nestjs/core';
import { Client } from '@elastic/elasticsearch';
import { DynamicModule, Inject, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { DEFAULT_CLIENT_NAME } from './constants';
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './module.declaration';
import { getElasticClientToken } from './injection-tokens';
import { ElasticDocumentClass } from './types';
import { createElasticProviders } from './create-elastic.providers';

@Module({})
export class ElasticClientModule extends ConfigurableModuleClass implements OnApplicationShutdown {
  private readonly _logger: Logger = new Logger(ElasticClientModule.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly clientOptions: typeof OPTIONS_TYPE,
    private readonly moduleRef: ModuleRef
  ) {
    super();
  }

  /**
   * @param documents - array of documents to be registered
   * @param clientName - name of the client
   * @description - Creates providers for every elastic document provider in the array
   */
  public static forFeature(
    documents: ElasticDocumentClass[],
    clientName: string = DEFAULT_CLIENT_NAME
  ): DynamicModule {
    const providers = createElasticProviders(documents, clientName);
    return {
      module: ElasticClientModule,
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
