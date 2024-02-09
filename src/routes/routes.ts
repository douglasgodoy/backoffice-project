import { Express } from 'express';
import signupController from 'src/controllers/teacher/signup/createNewTeacherController';
import getTeacherByIdController from 'src/controllers/teacher/get/getTeacherByIdController';
import signinController from 'src/controllers/teacher/signin/signinController';
import updateStatusController from 'src/controllers/teacher/updateStatus/updateStatusController';

const routes = (app: Express): void => {
  app.post('/teacher', signupController);
  app.get('/teacher/:userName', getTeacherByIdController);
  app.post('/signin', signinController);
  app.patch('/teacher', updateStatusController);
  // app.post('/class', createNewClassController);
  // app.patch('/class', EditClassController);
  // app.get('/classes/:teacherId', getClassesByTeacherIdController);
};

export default routes;
