import { Client } from '@elastic/elasticsearch';
import { Provider } from '@nestjs/common';
import { getCustomRepositoryMetadata } from './helpers';
import { getElasticClientToken, getElasticRepositoryToken } from './injection-tokens';
import { ElasticDocumentRegistry } from './registry';
import { ElasticRepository } from './repositories';
import { ElasticDocumentsMetadataStorage } from './storage';
import {
  CustomElasticRepositoryClass,
  CustomElasticRepositoryMetadata,
  ElasticDocumentClass
} from './types';

export const createElasticProviders = (
  documents: ElasticDocumentClass[],
  customRepositories: CustomElasticRepositoryClass[],
  clientName: string
): Provider[] => {
  return (documents || []).flatMap((document) => {
    const documentMetadata = ElasticDocumentsMetadataStorage.getDocumentMetadata(document);
    return [
      {
        provide: getElasticRepositoryToken(document),
        useFactory: async (client: Client): Promise<ElasticRepository<typeof document>> => {
          await ElasticDocumentRegistry.registerDocument(documentMetadata, client);
          return new ElasticRepository(client, documentMetadata);
        },
        inject: [getElasticClientToken(clientName)]
      },
      ...createCustomRepositoryProviders(customRepositories, clientName)
    ];
  });
};

const createCustomRepositoryProviders = (
  customRepositories: CustomElasticRepositoryClass[],
  clientName: string
): Provider[] => {
  return customRepositories
    .filter((repository) => getCustomRepositoryMetadata(repository))
    .map((repository) => {
      const { customRepository: CustomRepository, document } = getCustomRepositoryMetadata(
        repository
      ) as CustomElasticRepositoryMetadata;
      const documentMetadata = ElasticDocumentsMetadataStorage.getDocumentMetadata(document);
      return {
        provide: CustomRepository,
        useFactory: (client: Client) => new CustomRepository(client, documentMetadata),
        inject: [getElasticClientToken(clientName)]
      };
    });
};
