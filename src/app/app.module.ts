import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from 'src/common/jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patients/patient.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    UserModule,
    PatientModule,
    AuthModule,
    JwtModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  providers: [JwtService],
})
export class AppModule {}
