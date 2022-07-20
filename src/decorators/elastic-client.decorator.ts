import { Inject } from '@nestjs/common';
import { DEFAULT_CLIENT_NAME } from '../constants';
import { getElasticClientToken } from '../injection-tokens';
type InjectDecoratorType = ReturnType<typeof Inject>;

/**
 *
 * @param clientName - The name of the elastic client to inject. Provided in forRoot
 * @returns Elastic client instance
 */
export const InjectElasticClient = (
  clientName: string = DEFAULT_CLIENT_NAME
): InjectDecoratorType => Inject(getElasticClientToken(clientName));
