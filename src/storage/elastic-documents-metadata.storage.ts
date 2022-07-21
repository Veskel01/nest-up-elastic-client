import { MappingProperty } from '@elastic/elasticsearch/lib/api/types';
import { readJsonProperties } from '../helpers';
import {
  CreateIndexType,
  ElasticDocumentClass,
  ElasticDocumentMetadata,
  ElasticDocumentOptions,
  ElasticDocumentPropertyMetadata,
  PlainElasticDocumentPropertyMetadata
} from '../types';

export class ElasticDocumentsMetadataStorage {
  private static readonly _documentOptions: Map<string, ElasticDocumentOptions> = new Map();

  private static readonly _propertiesStorage: Map<string, PlainElasticDocumentPropertyMetadata[]> =
    new Map();

  public static registerNewDocument(
    document: ElasticDocumentClass,
    options: ElasticDocumentOptions
  ): void {
    this._documentOptions.set(document.name, options);
  }

  public static addDocumentPropertyMetadata(propertyMeta: ElasticDocumentPropertyMetadata): void {
    const { propertyName, options, target } = propertyMeta;
    const targetName = target.name;
    let propertiesCollection = this._propertiesStorage.get(targetName);
    if (!propertiesCollection) {
      propertiesCollection = [];
      this._propertiesStorage.set(targetName, propertiesCollection);
    }
    propertiesCollection.push({
      propertyName,
      options
    });
  }

  public static getDocumentMetadata(document: ElasticDocumentClass): ElasticDocumentMetadata {
    const options = this._documentOptions.get(document.name);
    const properties = this._propertiesStorage.get(document.name) || [];
    if (!options) {
      throw new Error(
        `No options found for document ${document.name}. Please decorate it with @ElasticDocument()`
      );
    }
    const { type } = options;
    let createIndexSettings: CreateIndexType;

    if (type === 'json') {
      const jsonProperties = readJsonProperties<CreateIndexType>(options.settingsJsonFilePath);
      createIndexSettings = jsonProperties;
    } else {
      createIndexSettings = options.createIndexSettings || {};
    }
    const metadata: ElasticDocumentMetadata = {
      indexName: options.indexName,
      createOnInit: options.createOnInit || false,
      synchronize: options.synchronize || false,
      createIndexSettings,
      propertiesMappings: this._convertPropertiesMetadataToMapping(properties),
      synchronizeSettings: options.synchronizeSettings || {}
    };
    this._validateDocumentMetadata(metadata);
    return metadata;
  }

  private static _validateDocumentMetadata(metadata: ElasticDocumentMetadata): void {
    if (!metadata.createIndexSettings) {
      throw new Error(
        `Provided document is not decorated with @ElasticDocument decorator. Please check your code.`
      );
    }
    if (!metadata.indexName) {
      throw new Error('Provided document does not have indexName defined.');
    }
  }

  private static _convertPropertiesMetadataToMapping(
    properties: PlainElasticDocumentPropertyMetadata[]
  ): Record<string, MappingProperty> {
    return properties.reduce((acc, { propertyName, options }) => {
      if (typeof options === 'string') {
        acc[propertyName] = readJsonProperties(options);
      } else {
        acc[propertyName] = {
          ...options
        };
      }
      return acc;
    }, {} as { [key: string]: MappingProperty });
  }
}
