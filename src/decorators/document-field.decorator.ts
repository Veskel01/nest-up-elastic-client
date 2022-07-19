import { DocumentPropertiesMetadataStorage } from '../document-properties-metadata.storage';
import { DocumentFieldOptions } from '../interfaces/lib-interfaces';

/**
 *
 * @param options - Can be specified as a configuration object, or a path to a configuration .json file
 */
export const DocumentField = (options: DocumentFieldOptions): PropertyDecorator => {
  return (target, propertyKey) => {
    DocumentPropertiesMetadataStorage.addFieldMetadataByTarget({
      name: propertyKey.toString(),
      target: target.constructor,
      options
    });
  };
};
