import { META_CUSTOM_ELASTIC_REPOSITORY } from '../constants';
import { CustomElasticRepositoryClass, CustomElasticRepositoryMetadata } from '../types';

export const getCustomRepositoryMetadata = (
  repository: CustomElasticRepositoryClass
): CustomElasticRepositoryMetadata | undefined => {
  return Reflect.getMetadata(META_CUSTOM_ELASTIC_REPOSITORY, repository) as
    | CustomElasticRepositoryMetadata
    | undefined;
};
