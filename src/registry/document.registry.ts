import { Client } from '@elastic/elasticsearch';
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types';
import { ElasticDocumentMetadata } from '../types';

export class ElasticDocumentRegistry {
  public static async registerDocument(
    metadata: ElasticDocumentMetadata,
    client: Client
  ): Promise<void> {
    const {
      synchronize,
      createOnInit,
      indexName,
      createIndexSettings,
      propertiesMappings,
      synchronizeSettings
    } = metadata;

    const didIndexExists = await client.indices.exists({
      index: indexName
    });

    if (!createOnInit) {
      return;
    } else {
      if (!didIndexExists) {
        await client.indices.create({
          ...createIndexSettings,
          mappings: {
            properties: propertiesMappings
          },
          index: indexName
        });
        return;
      }
    }

    if (didIndexExists && synchronize) {
      const [, indexMappings] = await Promise.all([
        client.indices.getSettings({
          index: indexName
        }),
        client.indices.getMapping({
          index: indexName
        })
      ]);
      const mappingsToUpdate = Object.entries(propertiesMappings).reduce((acc, [key, value]) => {
        if (
          indexMappings[indexName].mappings.properties &&
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          !indexMappings[indexName].mappings.properties![key]
        ) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, MappingProperty>);

      if (Object.keys(mappingsToUpdate).length > 0) {
        await client.indices.putMapping({
          index: indexName,
          properties: mappingsToUpdate
        });
      }

      await client.indices.putSettings({
        index: indexName,
        ...synchronizeSettings
      });
    }
  }
}
