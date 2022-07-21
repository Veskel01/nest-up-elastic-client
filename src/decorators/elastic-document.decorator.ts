import { META_ELASTIC_DOCUMENT_OPTIONS } from '../constants';
import { SetMetadata } from '@nestjs/common';
import { ElasticDocumentOptions } from '../types';

/**
 * @param {ElasticDocumentOptions} options - Elastic document options
 * @param {boolean} [options.createOnInit] - If set to true, automatically
 * creates an index with the specified configuration
 * @param {IndexOptions} [options.indexOptions] - Options for creating an index.
 * It can be a configuration object, or a path to a .json file that contains configurations
 */
export const ElasticDocument = (options: ElasticDocumentOptions): ClassDecorator =>
  SetMetadata(META_ELASTIC_DOCUMENT_OPTIONS, options);
