import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Patient {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  name: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
