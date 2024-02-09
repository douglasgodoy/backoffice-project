export type BodyRequest = {
  classDate?: string;
  description?: string;
  title?: string;
};

export type ParseUpdateDynamo = Record<
  string,
  { Action: string; Value: unknown }
>;
