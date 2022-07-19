import { Client } from '@elastic/elasticsearch';
import { Provider } from '@nestjs/common';
import { getElasticClientToken, getElasticDocumentPropsToken } from '../common';
import { getElasticDocumentProps } from '../helpers';
import { ElasticDocumentProps, ElasticDocumentType } from '../interfaces/lib-interfaces';
import { DocumentRegistry } from '../registry/document.registry';
import { ElasticDocumentMetadataFactory } from './elastic-document-metadata.factory';

export class ElasticProvidersFactory {
  public static create(documents: ElasticDocumentType[], clientName: string): Provider[] {
    return (documents || []).flatMap((document) => {
      const documentMetadata = ElasticDocumentMetadataFactory.create(document);
      return [
        {
          provide: getElasticDocumentPropsToken(document),
          useFactory: async (client: Client): Promise<ElasticDocumentProps<typeof document>> => {
            await DocumentRegistry.register(documentMetadata, client);
            return getElasticDocumentProps(documentMetadata);
          },
          inject: [getElasticClientToken(clientName)]
        }
      ];
    });
  }
}
