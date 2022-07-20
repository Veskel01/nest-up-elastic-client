import { Client } from '@elastic/elasticsearch';
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types';
import { RuntimeException } from '../exceptions';
import { readJsonProperties } from '../helpers';
import { ElasticDocumentMetadata } from '../types';

export class DocumentRegistry {
  public static async register(metadata: ElasticDocumentMetadata, client: Client): Promise<void> {
    const { documentOptions } = metadata;
    if (!documentOptions) {
      throw new RuntimeException(
        'Document options are not defined. Please define them in @ElasticDocument decorator.'
      );
    }
    const didIndexExists = await this._checkIfIndexExists(client, documentOptions.indexName);
    if (!didIndexExists && documentOptions.createOnInit) {
      await this._createIndex(client, metadata);
    }
  }

  private static async _createIndex(
    client: Client,
    metadata: ElasticDocumentMetadata
  ): Promise<void> {
    const { documentOptions } = metadata;
    const propertiesMappings = this._getIndexMappingsProperties({
      metadata
    });
    const { type } = documentOptions;
    if (type === 'json') {
      const jsonSettings = this._getJsonData(documentOptions.settingsJsonFilePath);
      await client.indices.create({
        index: documentOptions.indexName,
        ...jsonSettings
      });
      return;
    }

    await client.indices.create({
      index: documentOptions.indexName,
      ...documentOptions.indexOptions,
      ...documentOptions.transportOptions,
      mappings: {
        properties: propertiesMappings
      }
    });
  }

  private static _getIndexMappingsProperties({
    metadata
  }: {
    metadata: ElasticDocumentMetadata;
  }): Record<string, MappingProperty> {
    const { propertiesMetadata } = metadata;
    return propertiesMetadata.reduce((acc, { propertyName, options }) => {
      if (typeof options === 'string') {
        acc[propertyName] = readJsonProperties(options);
      } else {
        acc[propertyName] = {
          ...options
        };
      }

      return acc;
    }, {} as Record<string, MappingProperty>);
  }

  private static _checkIfIndexExists(client: Client, indexName: string): Promise<boolean> {
    return client.indices.exists({
      index: indexName
    });
  }

  private static _getJsonData<T extends Record<string, unknown>>(path: string): T {
    return readJsonProperties<T>(path);
  }
}
