import { Injectable, Module, OnModuleInit } from '@nestjs/common';
import {
  ElasticClientModule,
  ElasticDocument,
  ElasticRepository,
  InjectElasticRepository
} from './src';

@ElasticDocument({
  indexName: 'test',
  createOnInit: false,
  type: 'object-settings'
})
class TestDocument {
  public name: string;

  public age: number;
}

@Injectable()
class Service implements OnModuleInit {
  constructor(
    @InjectElasticRepository(TestDocument) private repo: ElasticRepository<TestDocument>
  ) {}

  async onModuleInit() {}
}

@Module({
  imports: [ElasticClientModule.forFeature([TestDocument])],
  providers: [Service]
})
export class TestModule {}
