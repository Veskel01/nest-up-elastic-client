import { Client } from '@elastic/elasticsearch';
import { Provider } from '@nestjs/common';
import {
  getDocumentMetadataToken,
  getElasticClientToken,
  getElasticRepositoryToken
} from './injection-tokens';
import { ElasticRepository } from './repositories';
import { ElasticDocumentClass } from './types';
import { getDocumentMetadata } from './helpers/get-document-metadata.helper';

export const createElasticProviders = (
  documents: ElasticDocumentClass[],
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
      }
    ];
  });
};
