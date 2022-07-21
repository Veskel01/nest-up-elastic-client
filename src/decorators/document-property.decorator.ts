import { ElasticDocumentsMetadataStorage } from '../storage';
import { ElasticDocumentProperty } from '../types';

/**
 *
 * @param options - Can be specified as a configuration object, or a path to a configuration .json file
 */
export const Property = (options: ElasticDocumentProperty): PropertyDecorator => {
  return (target, propertyKey) => {
    ElasticDocumentsMetadataStorage.addDocumentPropertyMetadata({
      options,
      propertyName: propertyKey.toString(),
      target: target.constructor
    });
  };
};
