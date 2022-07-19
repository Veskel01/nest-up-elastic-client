import { META_ELASTIC_DOCUMENT_OPTIONS } from '../constants';
import { DocumentPropertiesMetadataStorage } from '../document-properties-metadata.storage';
import { ElasticDocumentOptions, ElasticDocumentType } from '../interfaces/lib-interfaces';
import { DocumentMetadata } from '../interfaces/module-interfaces';

export class ElasticDocumentMetadataFactory {
  public static create(document: ElasticDocumentType): DocumentMetadata {
    const documentOptions = Reflect.getMetadata(
      META_ELASTIC_DOCUMENT_OPTIONS,
      document
    ) as ElasticDocumentOptions;

    const propertiesMetadata =
      DocumentPropertiesMetadataStorage.getFieldsMetadataByTarget(document);
    return {
      documentOptions,
      propertiesMetadata
    };
  }
}
