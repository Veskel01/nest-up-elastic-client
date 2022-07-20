import { Type } from '@nestjs/common';
import { ElasticRepository } from '../repositories';
import { ElasticDocumentClass } from './elastic-document.type';

export type CustomRepositoryClass = Type<ElasticRepository<unknown>>;

export interface CustomElasticRepositoryMetadata {
  target: Function;
  document: ElasticDocumentClass;
}
