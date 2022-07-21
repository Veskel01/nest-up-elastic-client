import { Property } from './document-property.decorator';
import { InjectElasticClient } from './elastic-client.decorator';
import { ElasticDocument } from './elastic-document.decorator';
import { InjectElasticRepository } from './elastic-repository.decorator';
import { CustomElasticRepository } from './custom-elastic-repository.decorator';

export {
  ElasticDocument,
  InjectElasticClient,
  InjectElasticRepository,
  Property,
  CustomElasticRepository
};
