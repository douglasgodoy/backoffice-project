export type DatabaseType = {
  startDatabase: () => Promise<unknown>;
  createTableIfNotExists: () => Promise<void>;
};
