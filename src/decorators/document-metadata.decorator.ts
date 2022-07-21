import { Inject } from '@nestjs/common';
import { getDocumentMetadataToken } from '../injection-tokens';
import { ElasticDocumentClass } from '../types';

export const InjectDocumentMetadata = (document: ElasticDocumentClass): ReturnType<typeof Inject> =>
  Inject(getDocumentMetadataToken(document));
