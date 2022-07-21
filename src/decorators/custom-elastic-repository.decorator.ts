import { META_CUSTOM_ELASTIC_REPOSITORY } from '../constants';
import {
  CustomElasticRepositoryClass,
  CustomElasticRepositoryMetadata,
  ElasticDocumentClass
} from '../types';

export const CustomElasticRepository = (document: ElasticDocumentClass): ClassDecorator => {
  return (target) => {
    const metadata: CustomElasticRepositoryMetadata = {
      customRepository: target as unknown as CustomElasticRepositoryClass,
      document
    };
    Reflect.defineMetadata(META_CUSTOM_ELASTIC_REPOSITORY, metadata, target);
  };
};
