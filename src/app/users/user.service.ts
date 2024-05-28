import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { DatabaseService } from 'src/database/database.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async createUser(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userModel.create(createUserDto);
      return newUser;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  async getUserByEmail(email: string) {
    try {
      const user = (await this.userModel.findOne({ email })).populate(
        'patients',
      );
      return user;
    } catch (e) {
      return null;
    }
  }
}
