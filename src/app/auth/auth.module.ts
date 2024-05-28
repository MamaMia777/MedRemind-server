import { Module } from '@nestjs/common';
import { JwtModule } from 'src/common/jwt/jwt.module';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
