import { Inject } from '@nestjs/common';
import { getElasticRepositoryToken } from '../injection-tokens';
import { ElasticDocumentClass } from '../types';

export const InjectElasticRepository = (
  document: ElasticDocumentClass
): ReturnType<typeof Inject> => Inject(getElasticRepositoryToken(document));
