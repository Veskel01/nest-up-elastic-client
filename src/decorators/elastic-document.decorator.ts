import { ElasticDocumentsMetadataStorage } from '../storage';
import { ElasticDocumentOptions } from '../types';

/**
 * @param {ElasticDocumentOptions} options - Elastic document options
 * @param {boolean} [options.createOnInit] - If set to true, automatically
 * creates an index with the specified configuration
 * @param {IndexOptions} [options.indexOptions] - Options for creating an index.
 * It can be a configuration object, or a path to a .json file that contains configurations
 */
export const ElasticDocument = (options: ElasticDocumentOptions): ClassDecorator => {
  return (target) => {
    ElasticDocumentsMetadataStorage.registerNewDocument(target, options);
  };
};
