class TeacherAuthService implements Auth {
  salts: number;
  constructor(private authService: typeof import('bcrypt')) {
    this.salts = Number(process.env.SALT_ROUNDS);
  }

  async generateSalt(saltRounds = 1): Promise<string> {
    return await this.authService.genSalt(saltRounds);
  }

  async hash(password: string) {
    return await this.authService.hash(
      password,
      await this.generateSalt(this.salts),
    );
  }

  async compare(plainText: string, password: string) {
    return await this.authService.compare(plainText, password);
  }
}

export default TeacherAuthService;

interface Auth {
  generateSalt(saltRounds: number): Promise<string>;
  hash(password: string): Promise<string>;
  compare(plainText: string, password: string): Promise<boolean>;
}
