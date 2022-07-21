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
  indexOptions: {
    settings: {
      analysis: {
        analyzer: {
          custom_analyzer: {
            type: 'custom',
            tokenizer: 'standard',
            filter: ['lowercase']
          }
        }
      }
    }
  }
})
export class ProductDocument
```

in the `@ElasticDocument()` decorator, you can enter all the configuration options for your index in the form of an object, or provide the path to the.json file with the index configuration if you select json as type:

```typescript
@ElasticDocument({
  indexName: 'products',
  type: 'json',
  settingsJsonFilePath: './index-mappings/products.index.json'
})
export class ProductDocument {}
```

In ./index-mappings/products.index.json

```json
{
  "indexName": "products",
  "type": "object-settings",
  "indexOptions": {
    "settings": {
      "analysis": {
        "analyzer": {
          "custom_analyzer": {
            "type": "custom",
            "tokenizer": "standard",
            "filter": ["lowercase"]
          }
        }
      }
    }
  }
}
```

Each document may have its own properties, which will be entered in the mappings object in the index. To do that decorate selected properties with `@Property()` decorator

```typescript
@ElasticDocument({
  indexName: 'products',
  type: 'object-settings',
  createIndexSettings: {
    settings: {
      analysis: {
        analyzer: {
          custom_analyzer: {
            type: 'custom',
            tokenizer: 'standard',
            filter: ['lowercase']
          }
        }
      }
    }
  }
})
export class ProductDocument {
  @Property({
    type: 'text',
    analyzer: 'custom_analyzer'
  })
  public name: string;

  @Property({
    type: 'nested',
    properties: {
      name: {
        type: 'text'
      }
    }
  })
  public boughtBy: Array<{ name: string }>;
}
```

You can specify the property configuration as an object or as a path to a configuration file.

```typescript
export class ProductDocument {
  @Property('./propertyMappings/products-index/name-mapping.json')
  public name: string;
}
```

Then define your config in ./propertyMappings/products-index/name-mapping.json

```json
{
  "type": "text",
  "analyzer": "custom_analyzer"
}
```

The synchronize option allows the settings in the decorator to be synchronised with the settings of the index. `WARNING` This option will change your index settings, so it is highly recommended to deactivate this option on production

```typescript
@ElasticDocument({
  indexName: 'products',
  type: 'object-settings',
  createOnInit: true,
  synchronize: true,
  synchronizeSettings: {
    settings: {
      number_of_replicas: 1,
      hidden: true
    }
  }
})
export class ProductDocument {}
```

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

## Multiple clients

You can create multiple clients, each for a different connection. To do this, register clients in the module:

```typescript
@Module({
  imports: [
    ElasticClientModule.forRoot({
      node: 'http://localhost:9200'
    }),
    ElasticClientModule.forRoot({
      clientName: 'second-client',
      node: 'http://localhost:9300'
    })
  ]
})
class AppModule {}
```

Once you have created a new client, you can inject it into your service

```typescript
@Injectable()
export class MyService {
  constructor(@InjectElasticClient('second-client') private readonly client: Client) {}
}
```

To have access the repositories, register your documents, for the relevant client

```typescript
@Module({
  imports: [
    ElasticClientModule.forFeature({
      documents: [SecondProduct],
      clientName: 'second-client'
    })
  ]
})
export class SecondProductsModule {}
```

You can now inject repositories for a new client

```typescript
@Injectable()
export class TestService {
  constructor(
    @InjectElasticRepository(SecondProduct) private repo: ElasticRepository<SecondProduct>
  ) {}
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

After that, register your custom repository in customRepositories section in the ElasticClient:

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
