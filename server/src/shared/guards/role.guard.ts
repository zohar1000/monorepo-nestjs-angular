import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '@shared-all/enums/role.enum';
import { RoleRate } from '@shared-all/consts/role-rate.const';

@Injectable()
export class RoleGuard implements CanActivate {
  readonly minRoleRate = RoleRate[Role.Member];

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.user || !req.user.role) return false;
    return RoleRate[req.user.role] >= this.minRoleRate;
  }
}
