import { ModuleRef } from '@nestjs/core';
import { Client } from '@elastic/elasticsearch';
import {
  DynamicModule,
  Inject,
  Logger,
  Module,
  OnApplicationShutdown,
  OnModuleInit
} from '@nestjs/common';
import { getElasticClientToken } from './common';
import { DEFAULT_CLIENT_NAME } from './constants';
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './module.declaration';
import { ElasticProvidersFactory } from './factories';
import { ForFeatureOptions } from './interfaces/lib-interfaces';
import { RuntimeException } from './exceptions';

@Module({})
export class ElasticClientModule
  extends ConfigurableModuleClass
  implements OnApplicationShutdown, OnModuleInit
{
  private readonly _logger: Logger = new Logger(ElasticClientModule.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly clientOptions: typeof OPTIONS_TYPE,
    private readonly moduleRef: ModuleRef
  ) {
    super();
  }

  /**
   * @param options.documents - array of documents to be registered
   * @param options.clientName - name of the client
   * @description - Creates providers for every elastic document provider in the array
   */
  public static forFeature({
    documents = [],
    clientName = DEFAULT_CLIENT_NAME
  }: ForFeatureOptions): DynamicModule {
    const providers = ElasticProvidersFactory.create(documents, clientName);

    return {
      module: ElasticClientModule,
      providers,
      exports: providers
    };
  }

  async onModuleInit(): Promise<void> {
    const elasticClient = this.moduleRef.get<Client>(
      getElasticClientToken(this.clientOptions.clientName),
      { strict: false }
    );
    try {
      const isConnected = await elasticClient.ping();
      if (!isConnected) {
        throw new RuntimeException('Elastic client is not connected');
      }
    } catch (err) {
      this._logger.error(err?.message);
      throw new RuntimeException('Elastic client is not connected');
    }
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
