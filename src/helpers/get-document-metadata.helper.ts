import { META_ELASTIC_DOCUMENT_OPTIONS } from '../constants';
import { RuntimeException } from '../exceptions';
import { ElasticDocumentPropertiesStorage } from '../storage';
import { ElasticDocumentClass, ElasticDocumentMetadata, ElasticDocumentOptions } from '../types';

export function getDocumentMetadata(document: ElasticDocumentClass): ElasticDocumentMetadata {
  const documentOptions = Reflect.getMetadata(
    META_ELASTIC_DOCUMENT_OPTIONS,
    document
  ) as ElasticDocumentOptions;
  const propertiesMetadata = ElasticDocumentPropertiesStorage.getDocumentProperties(document);

  const metadata: ElasticDocumentMetadata = {
    documentOptions,
    propertiesMetadata
  };
  validateDocumentMetadata(metadata);
  return metadata;
}

const validateDocumentMetadata = (metadata: ElasticDocumentMetadata): void => {
  if (!metadata.documentOptions) {
    throw new RuntimeException(
      `Provided document is not decorated with @ElasticDocument decorator. Please check your code.`
    );
  }
  if (!metadata.documentOptions.indexName) {
    throw new RuntimeException('Provided document does not have indexName defined.');
  }
};
