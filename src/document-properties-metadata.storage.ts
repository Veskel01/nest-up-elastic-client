import {
  DocumentPropertyMetadata,
  DocumentPropertyMetadataWithoutTarget
} from './interfaces/module-interfaces';

export class DocumentPropertiesMetadataStorage {
  public static readonly propertiesStorage: Map<string, DocumentPropertyMetadataWithoutTarget[]> =
    new Map();

  public static addFieldMetadataByTarget(property: DocumentPropertyMetadata): void {
    const targetName = property.target.name;
    let propertiesCollection = this.propertiesStorage.get(targetName);
    if (!propertiesCollection) {
      propertiesCollection = [];
      this.propertiesStorage.set(targetName, propertiesCollection);
    }
    const { name, options: propertyOptions } = property;
    propertiesCollection.push({ name, options: propertyOptions });
  }

  public static getFieldsMetadataByTarget(
    target: Function
  ): DocumentPropertyMetadataWithoutTarget[] {
    const targetName = target.name;
    const propertiesCollection = this.propertiesStorage.get(targetName);
    if (!propertiesCollection) {
      return [];
    }
    return propertiesCollection;
  }
}
