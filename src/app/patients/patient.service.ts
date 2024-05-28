import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { DatabaseService } from 'src/database/database.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from 'src/common/schemas/patient.schema';
import { User } from 'src/common/schemas/user.schema';
import { CreatePatientDto } from './dto/create-patiend.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async createPatient(dto: CreatePatientDto) {
    try {
      const { userEmail, ...rest } = dto;
      const findUser = await this.userModel.findOne({ email: userEmail });
      if (!findUser) {
        throw new InternalServerErrorException('User not found');
      }
      const newPatient = await this.patientModel.create(rest);
      await findUser.updateOne({ $push: { patients: newPatient._id } });
      return newPatient;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e.message);
    }
  }
  async deletePatient(dto: { userEmail: string; email: string }) {
    try {
      console.log('Deleteing patient', dto);
      const user = await this.userModel.findOne({ email: dto.userEmail });
      if (!user) {
        throw new InternalServerErrorException('User not found');
      }
      await this.patientModel.deleteOne({ email: dto.email });
      return true;
    } catch (e) {
      return false;
    }
  }
  catch(e) {}
}
