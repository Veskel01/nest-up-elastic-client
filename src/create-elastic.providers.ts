import { Client } from '@elastic/elasticsearch';
import { Provider } from '@nestjs/common';
import {
  getDocumentMetadataToken,
  getElasticClientToken,
  getElasticRepositoryToken
} from './injection-tokens';
import { ElasticRepository } from './repositories';
import { ElasticDocumentClass, ElasticDocumentMetadata } from './types';
import { getDocumentMetadata } from './helpers/get-document-metadata.helper';
import { CustomRepositoryClass } from './types/custom-elastic-repository.interface';
import { getCustomRepositoryMetadata } from './helpers';

export const createElasticProviders = (
  documents: ElasticDocumentClass[],
  customRepositories: CustomRepositoryClass[],
  clientName: string
): Provider[] => {
  return (documents || []).flatMap((document) => {
    const documentMetadata = getDocumentMetadata(document);
    return [
      {
        provide: getElasticRepositoryToken(document),
        useFactory: (client: Client): ElasticRepository<typeof document> =>
          new ElasticRepository(client, documentMetadata),
        inject: [getElasticClientToken(clientName)]
      },
      {
        provide: getDocumentMetadataToken(document),
        useValue: documentMetadata
      },
      ...createCustomRepositoryProviders(customRepositories, clientName)
    ];
  });
};

const createCustomRepositoryProviders = (
  customRepositories: CustomRepositoryClass[],
  clientName: string
): Provider[] => {
  return customRepositories.map((Repository) => {
    const metadata = getCustomRepositoryMetadata(Repository);
    return {
      provide: metadata.target,
      useFactory: (client: Client, metadata: ElasticDocumentMetadata) =>
        new Repository(client, metadata),
      inject: [getElasticClientToken(clientName), getDocumentMetadataToken(metadata.document)]
    };
  });
};
