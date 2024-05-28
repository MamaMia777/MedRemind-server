import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Patient } from './patient.schema';

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  surname: string;

  @Prop()
  avatarUrl: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }] })
  patients: Array<Patient>;
}

export const UserSchema = SchemaFactory.createForClass(User);
