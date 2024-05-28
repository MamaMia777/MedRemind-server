import { IPatient } from 'src/common/interfaces/user';

export interface CreatePatientDto extends IPatient {
  userEmail: string;
}
