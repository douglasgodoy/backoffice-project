import bcrypt from 'bcrypt';
import TeacherAuthService from './TeacherAuthService';

describe('TeacherAuthService', () => {
  let teacherAuthService: TeacherAuthService;

  beforeEach(() => {
    teacherAuthService = new TeacherAuthService(bcrypt);
  });

  describe('generateSalt', () => {
    it('should generate a salt', async () => {
      const salt = await teacherAuthService.generateSalt();
      expect(salt).toBeDefined();
    });

    it('should generate a salt with custom salt rounds', async () => {
      const customSaltRounds = 10;
      const salt = await teacherAuthService.generateSalt(customSaltRounds);
      expect(salt).toBeDefined();
    });
  });

  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'testPassword';
      const hashedPassword = await teacherAuthService.hash(password);
      expect(hashedPassword).toBeDefined();
    });
  });

  describe('compare', () => {
    it('should return true for matching passwords', async () => {
      const plainText = 'testPassword';
      const hashedPassword = await bcrypt.hash(plainText, 10);
      const result = await teacherAuthService.compare(
        plainText,
        hashedPassword,
      );
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const plainText = 'testPassword';
      const hashedPassword = await bcrypt.hash('wrongPassword', 10);
      const result = await teacherAuthService.compare(
        plainText,
        hashedPassword,
      );
      expect(result).toBe(false);
    });
  });
});
