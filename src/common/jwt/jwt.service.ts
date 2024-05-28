import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  // Should implement ENV variable for this @MamaMia_777
  private readonly secretKey: string = 'medRemindSecretKey';

  constructor() {}

  generateToken(payload: any, expiresIn: string): string {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }
  verifyToken(token: string): any {
    try {
      const decoded = jwt.verify(token, this.secretKey);
      return decoded;
    } catch (error) {
      return error.message;
    }
  }
}
