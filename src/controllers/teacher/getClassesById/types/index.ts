export type ClassFromDatabase = {
  PK: string;
  ClassDate: string;
  ClassTitle: string;
  Description: string;
  Username: string;
};

export type ClassFromHttp = {
  id: string;
  classDate: string;
  title: string;
  description: string;
  teacher: string;
};
