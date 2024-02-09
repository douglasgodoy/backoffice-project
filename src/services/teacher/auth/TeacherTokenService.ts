export class TeacherTokenService {
  constructor(private tokenService: typeof import('jsonwebtoken')) {
    this.tokenService = tokenService;
  }

  verify(token: string) {
    return this.tokenService.verify(token, process.env.SECRET_KEY || '');
  }

  async sign(payload: Record<string, unknown>, expiresIn = 172800) {
    return this.tokenService.sign({ payload }, process.env.SECRET_KEY || '', {
      expiresIn: expiresIn,
    });
  }
}
