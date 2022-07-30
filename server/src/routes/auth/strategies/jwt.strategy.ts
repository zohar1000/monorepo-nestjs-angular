import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserStatus } from '../enums/user-status.enum';
import { UserService } from '@shared-server/services/entities/user.service';
import { serverConfig } from '@shared-server/consts/server-config';
import { User } from '@shared-all/models/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: serverConfig.auth.jwt.accessTokenSecretKey
    });
  }

  async validate(payload: any) {
    let validatedUser;
    try {
      const user: User = await this.userService.findOneById(payload.sub.userId) as User;
      if (user && user.status === UserStatus.Active) {
        validatedUser = { id: user._id, role: user.role, status: user.status };
      }
    } catch (e) {
      // user = {};
    }
    return validatedUser;
  }
}
