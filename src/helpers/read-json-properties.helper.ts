import * as fse from 'fs-extra';

export function readJsonProperties<T extends Record<string, unknown>>(path: string): T {
  const basePath = process.cwd();
  let jsonFilePath = `${basePath}/${path}`;
  if (!jsonFilePath.endsWith('.json')) {
    jsonFilePath = `${jsonFilePath}.json`;
  }
  const readResult = fse.readJsonSync(jsonFilePath) as T;
  return readResult;
}
