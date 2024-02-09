import TeacherAuthService from './TeacherAuthService';
import bcrypt from 'bcrypt';

const auth = new TeacherAuthService(bcrypt);

export default auth;
