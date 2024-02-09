import { BodyRequest } from 'src/controllers/class/update/types';

export type UpdateClassTypeParams = {
  id: string;
  body: BodyRequest;
  teacherId: string;
};
