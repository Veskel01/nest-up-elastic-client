import { META_CUSTOM_ELASTIC_REPOSITORY } from '../constants';
import {
  CustomElasticRepositoryMetadata,
  CustomRepositoryClass
} from '../types/custom-elastic-repository.interface';

// TODO - validate
export const getCustomRepositoryMetadata = (
  repo: CustomRepositoryClass
): CustomElasticRepositoryMetadata => {
  const metadata = Reflect.getMetadata(
    META_CUSTOM_ELASTIC_REPOSITORY,
    repo
  ) as CustomElasticRepositoryMetadata;
  return metadata;
};
