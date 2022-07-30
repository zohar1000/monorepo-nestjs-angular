import { Role } from '@shared-all/enums/role.enum';

export class UserProfile {
  _id: string;
  userName: string;
  email: string;
  status: number;
  firstName: string;
  lastName: string;
  role: Role;
}


