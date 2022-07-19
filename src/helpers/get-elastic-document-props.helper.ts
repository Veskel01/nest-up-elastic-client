import { ElasticDocumentProps } from '../interfaces/lib-interfaces';
import { DocumentMetadata } from '../interfaces/module-interfaces';

export const getElasticDocumentProps = ({
  documentOptions,
  propertiesMetadata
}: DocumentMetadata): ElasticDocumentProps<any> => {
  const documentProperties = propertiesMetadata.reduce((acc, { name, options }) => {
    acc[name as keyof ElasticDocumentProps<any>] = options || {};

    return acc;
  }, {} as Record<string, unknown>);

  return {
    indexName: documentOptions.indexName,
    documentProperties
  } as ElasticDocumentProps<any>;
};
