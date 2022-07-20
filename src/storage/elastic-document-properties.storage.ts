import {
  ElasticDocumentClass,
  ElasticDocumentPropertyMetadata,
  PlainElasticDocumentPropertyMetadata
} from '../types';

export class ElasticDocumentPropertiesStorage {
  private static readonly propertiesStorage: Map<string, PlainElasticDocumentPropertyMetadata[]> =
    new Map();

  public static addDocumentProperty(propertyMeta: ElasticDocumentPropertyMetadata): void {
    const { propertyName, options, target } = propertyMeta;
    const targetName = target.name;

    let propertiesCollection = this.propertiesStorage.get(targetName);

    if (!propertiesCollection) {
      propertiesCollection = [];
      this.propertiesStorage.set(targetName, propertiesCollection);
    }
    propertiesCollection.push({
      propertyName,
      options
    });
  }

  public static getDocumentProperties(
    document: ElasticDocumentClass
  ): PlainElasticDocumentPropertyMetadata[] {
    const targetName = document.name;
    const propertiesCollection = this.propertiesStorage.get(targetName);
    return propertiesCollection || [];
  }
}
