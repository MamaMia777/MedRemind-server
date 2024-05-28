import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from 'src/common/jwt/jwt.module';
import { Patient, PatientSchema } from 'src/common/schemas/patient.schema';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { UserModule } from '../users/user.module';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Patient.name, schema: PatientSchema },
    ]),
    JwtModule,
    UserModule,
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
