import {
  Body,
  Controller,
  Delete,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreatePatientDto } from './dto/create-patiend.dto';
import { PatientService } from './patient.service';

@UseGuards(JwtGuard)
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  createPatient(@Body() dto: CreatePatientDto, @Req() req: any) {
    const userEmail = req?.email ?? null;
    return this.patientService.createPatient({ ...dto, userEmail });
  }

  @Delete()
  deletePatient(@Query() dto: { email: string }, @Req() req: any) {
    const userEmail = req?.email ?? null;
    return this.patientService.deletePatient({ userEmail, email: dto.email });
  }
}
