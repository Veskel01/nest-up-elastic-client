import { ClientOptions } from '@elastic/elasticsearch';
import { ConfigurableModuleAsyncOptions, DynamicModule, Module } from '@nestjs/common';
import { ElasticClientCoreModule } from './elastic-client-core.module';
import {
  CustomElasticRepositoryClass,
  ElasticClientModuleExtras,
  ElasticDocumentClass
} from './types';

@Module({})
export class ElasticClientModule {
  public static forRoot(options: ClientOptions & ElasticClientModuleExtras): DynamicModule {
    return {
      module: ElasticClientModule,
      imports: [ElasticClientCoreModule.forRoot(options)],
      exports: [ElasticClientCoreModule]
    };
  }

  public static forRootAsync(
    options: ConfigurableModuleAsyncOptions<ClientOptions, 'createElasticsearchModuleOptions'> &
      ElasticClientModuleExtras
  ): DynamicModule {
    return {
      module: ElasticClientModule,
      imports: [ElasticClientCoreModule.forRootAsync(options)],
      exports: [ElasticClientCoreModule]
    };
  }

  public static forFeature(options: {
    documents: ElasticDocumentClass[];
    customRepositories?: CustomElasticRepositoryClass[] | undefined;
    clientName?: string | undefined;
  }): DynamicModule {
    return {
      module: ElasticClientModule,
      imports: [ElasticClientCoreModule.forFeature(options)],
      exports: [ElasticClientCoreModule]
    };
  }
}
