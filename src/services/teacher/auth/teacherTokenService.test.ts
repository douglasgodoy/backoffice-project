import jwt from 'jsonwebtoken';
import { TeacherTokenService } from './TeacherTokenService';

jest.mock('jsonwebtoken');

describe('TeacherTokenService', () => {
  let teacherTokenService: TeacherTokenService;

  beforeEach(() => {
    // Configuração comum antes de cada teste
    teacherTokenService = new TeacherTokenService(jwt);
  });

  describe('verify', () => {
    it('should verify a valid token', () => {
      const mockToken = 'validToken';
      const mockDecodedPayload = { userId: '123', role: 'teacher' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecodedPayload);

      const result = teacherTokenService.verify(mockToken);

      expect(result).toEqual(mockDecodedPayload);
    });

    it('should throw an error for an invalid token', () => {
      const mockToken = 'invalidToken';

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => teacherTokenService.verify(mockToken)).toThrowError(
        'Invalid token',
      );
    });
  });

  describe('sign', () => {
    it('should sign a payload with default expiration', async () => {
      const mockPayload = { userId: '123', role: 'teacher' };
      const mockToken = 'signedToken';

      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await teacherTokenService.sign(mockPayload);

      expect(result).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { payload: mockPayload },
        process.env.SECRET_KEY || '',
        { expiresIn: 172800 },
      );
    });

    it('should sign a payload with custom expiration', async () => {
      const mockPayload = { userId: '123', role: 'teacher' };
      const mockToken = 'signedToken';
      const customExpiresIn = 3600;

      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await teacherTokenService.sign(
        mockPayload,
        customExpiresIn,
      );

      expect(result).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { payload: mockPayload },
        process.env.SECRET_KEY || '',
        { expiresIn: customExpiresIn },
      );
    });
  });
});
