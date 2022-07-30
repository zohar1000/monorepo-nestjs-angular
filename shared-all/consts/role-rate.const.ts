import { Role } from '../enums/role.enum';

export const RoleRate = {
  [Role.Owner]: 100,
  [Role.Admin]: 80,
  [Role.Manager]: 60,
  [Role.Member]: 40
};
