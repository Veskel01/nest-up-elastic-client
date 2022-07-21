import { Client } from '@elastic/elasticsearch';
import { Injectable, Module, OnModuleInit } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ElasticClientFactoryOptions,
  ElasticClientModule,
  ElasticClientOptionsFactory,
  ElasticDocumentMetadata,
  InjectDocumentMetadata,
  InjectElasticClient
} from './src';

class ProductDocument {}

@Injectable()
export class ProductSearchService implements OnModuleInit {
  constructor(
    @InjectElasticClient() private readonly client: Client,
    @InjectDocumentMetadata(ProductDocument) private readonly metadata: ElasticDocumentMetadata
  ) {}

  public async onModuleInit() {
    const data = await this.client.search({
      index: this.metadata.documentOptions.indexName
      // ...logic
    });
  }
}
