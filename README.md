# Nest.js Elastic-client

## Installation

```bash
$ not avaliable yet
```

## Usage

As a first step import `ElasticClientModule` in your root module:

```typescript
@Module({
  imports: [
    ElasticClientModule.forRoot({
      node: 'http://localhost:9200'
    })
  ]
})
export class AppModule {}
```

Then define your Document class and decorate it with `@ElasticDocment()` decorator:

```typescript
@ElasticDocument({
  indexName: 'products',
  type: 'object-settings',
  createOnInit: true,
  indexOptions: {},
  transportOptions: {}
})
export class ProductDocument {}
```

// TODO - options

| Option       |                             Description                              |
| ------------ | :------------------------------------------------------------------: |
| indexName    |       The name of the index to be registered in elasticsearch        |
| type         | Type of option. They may be specified as `object-settings` or `json` |
| indexOptions |                            right-aligned                             |

Next register your document in module:

```typescript
@Module({
  imports: [
    ElasticClientModule.forFeature({
      documents: [ProductDocument]
    })
  ]
})
export class ProductsModule {}
```

This allows you to inject the document repository in service with `@InjectElasticRepository()` decorator

```typescript
@Injectable()
export class ProductService {
  constructor(
    @InjectElasticRepository(ProductDocument)
    private readonly repo: ElasticRepository<ProductDocument>
  ) {}

  public async findAll() {
    return this.repo.findAll();
  }
}
```

## Async Options

**1. UseFactory**

```typescript
@Module({
  imports: [
    ElasticClientModule.forRootAsync({
      useFactory: () => {
        return {
          node: 'http://localhost:9200'
        };
      }
    })
  ]
})
class AppModule {}
```

**2. Use class**

```typescript
@Injectable()
class ElasticClientConfigService implements ElasticClientOptionsFactory {
  createElasticsearchModuleOptions(): ElasticClientFactoryOptions {
    return {
      node: ['http://localhost:9200']
    };
  }
}
```

```typescript
@Module({
  imports: [
    ElasticClientModule.forRootAsync({
      useClass: ElasticClientConfigService
    })
  ]
})
export class AppModule {}
```

**3. Use existnig**

```typescript
@Module({
  imports: [
    ElasticClientModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService
    })
  ]
})
class AppModule {}
```

## Elastic Client

If you don't want to use repositories - you can inject the elastic client directly into your service

```typescript
@Injectable()
class ProductSearchService {
  constructor(@InjectElasticClient() private readonly client: Client) {}
}
```

In addition, you can inject all the information about the document thanks to the `@InjectDocumentMetadata()` decorator

```typescript
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
```

## Custom Repositories

ElasticClientModule allows you to create your own custom repositories. To do so, create your custom repository and decorate it with the `@CustomElasticRepository()` decorator

```typescript
@CustomElasticRepository(ProductDocument)
export class ProductsCustomRepository extends ElasticRepository<ProductDocument> {
  public async customOperation() {
    return this.client.search({
        ...// query implementation
    })
  }
}
```

After that, register your custom repository in the module:

```typescript
@Module({
  imports: [
    ElasticClientModule.forFeature({
      documents: [ProductDocument],
      customRepositories: [ProductsCustomRepository]
    })
  ]
})
export class ProductsModule {}
```

Your custom repository is located in Nest injection scope. This allows you to export it from module or implement lifecycle interfaces

```typescript
@CustomElasticRepository(ProductDocument)
export class ProductsCustomRepository
  extends ElasticRepository<ProductDocument>
  implements OnModuleInit
{
  async onModuleInit() {
    // ...logic
  }
}
```
