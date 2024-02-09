import { Express } from 'express';
import signupController from 'src/controllers/teacher/signup/signupController';
import getTeacherByIdController from 'src/controllers/teacher/get/getTeacherByIdController';
import signinController from 'src/controllers/teacher/signin/signinController';
import updateStatusController from 'src/controllers/teacher/updateStatus/updateStatusController';
import registerNewClassController from 'src/controllers/class/register/registerNewClassController';
import getClassesByIdController from 'src/controllers/teacher/getClassesById/getClassesByIdController';
import { verifyToken } from 'src/middlewares/verifyToken';
import updateClassController from 'src/controllers/class/update/updateClassController';

const routes = (app: Express): void => {
  app.post('/teacher', signupController);
  app.get('/teacher/:userName', getTeacherByIdController);
  app.post('/signin', signinController);
  app.patch('/teacher', updateStatusController);
  app.post('/class', verifyToken, registerNewClassController);
  app.get('/classes/:teacherId', verifyToken, getClassesByIdController);
  app.patch('/class/:classId', verifyToken, updateClassController);
};

export default routes;
