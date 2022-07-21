import { Type } from '@nestjs/common';
import { ElasticRepository } from '../repositories';
import { ElasticDocumentClass } from './elastic-document.type';

export type CustomElasticRepositoryClass = Type<ElasticRepository<unknown>>;

export interface CustomElasticRepositoryMetadata {
  customRepository: CustomElasticRepositoryClass;
  document: ElasticDocumentClass;
}
