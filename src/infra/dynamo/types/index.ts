export type DatabaseType = {
  runMigrations?(dbInstance: unknown): Promise<unknown>;
  startDatabase: () => Promise<unknown>;
  createTableIfNotExists: () => Promise<void>;
  createIndexes?: (dbInstance: unknown) => Promise<void>;
};
