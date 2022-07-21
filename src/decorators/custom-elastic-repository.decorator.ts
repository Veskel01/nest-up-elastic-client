import { META_CUSTOM_ELASTIC_REPOSITORY } from '../constants';
import { ElasticDocumentClass } from '../types';
import { CustomElasticRepositoryMetadata } from '../types/custom-elastic-repository.interface';

export const CustomElasticRepository = (document: ElasticDocumentClass): ClassDecorator => {
  return (target) => {
    const metadata: CustomElasticRepositoryMetadata = {
      target,
      document
    };
    Reflect.defineMetadata(META_CUSTOM_ELASTIC_REPOSITORY, metadata, target);
  };
};
