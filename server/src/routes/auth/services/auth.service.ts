import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { ZObj } from 'zshared';
import { EncryptionService } from '@shared-server/services/encryption.service';
import { UserService } from '@shared-server/services/entities/user.service';
import { LoginDto } from '../dtos/login.dto';
import { UserStatus } from '../enums/user-status.enum';
import { AuthUser } from '@shared-server/models/auth-user.model';
import { BaseService } from '@shared-server/classes/base.service';
import { LocalStrategyResponse } from '@shared-all/models/local-strategy-response.model';
import { ServerLoginResponse } from '@shared-all/models/server-login-response.model';
import { User } from '@shared-all/models/entities/user.entity';
import { UserProfile } from '@shared-all/models/entities/user-profile.model';
import { RefreshTokenResponse } from '@shared-all/models/refresh-token-response.model';
import { serverConfig } from '@shared-server/consts/server-config';

@Injectable()
export class AuthService extends BaseService {
  constructor(private readonly userService: UserService,
              private readonly jwtService: JwtService,
              private readonly encryptionService: EncryptionService) {
    super();
  }

  /*************************************/
  /*   L O G I N  /  S I G N   U P     */
  /*************************************/

  async permissions(authUser: AuthUser) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = authUser ? await this.userService.findOneById(authUser.id) : null;
        if (!user) {
          this.logi('permission request was made for a user which does not exist', authUser);
          reject(new Error('user does not exist'));
        } else {
          resolve(this.getAuthProfile(user));
        }
      } catch (e) {
        this.loge('permissions failed', authUser, e);
        reject(e);
      }
    });
  }

  async login(dto: LoginDto, resp: LocalStrategyResponse) {
    return new Promise<ServerLoginResponse>(async (resolve, reject) => {
      try {
        if (!resp.isLoginSuccess) {
          resolve( { isSuccess: false, message: 'invalid user/password' });
        } else {
          const user = resp.user;
          // TODO: update last login time?
          // await this.userService.updateById(userDoc._id, { lastLoginTime: Date.now()});
          const profile: UserProfile = this.getAuthProfile(user);
          const accessToken = await this.getAccessToken({ userId: user._id });
          const refreshToken = await this.getRefreshToken({ userId: user._id });
          resolve({ isSuccess: true, user: profile, accessToken, refreshToken });
        }
      } catch (e) {
        this.loge('login failed', dto, e);
        reject(e);
      }
    });
  }

  async refresh(refreshToken) {
    return new Promise<RefreshTokenResponse>(async (resolve, reject) => {
      try {
        const token = refreshToken ? await this.verifyRefreshToken(refreshToken) as any : null;
        if (token) {
          const accessToken = await this.getAccessToken({ userId: token.userId });
          const newRefreshToken = await this.getRefreshToken({ userId: token.userId });
          resolve({ isSuccess: true, accessToken, refreshToken: newRefreshToken });
        } else {
          reject(new Error('user is not authorized'));
        }
      } catch (e) {
        this.loge('refresh failed', refreshToken, e);
        reject(e);
      }
    });
  }

  async forgotPassword(email) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        email = email.trim();
        const user: User = await this.userService.findByEmail(email);
        if (!user) this.logiAndThrow('invalid email');
        const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const CHARS_LEN = CHARS.length;
        const PASSWORD_LENGTH = 8;
        let verbalPassword = '';
        for (let i = 0; i < PASSWORD_LENGTH; i++) {
          verbalPassword += CHARS.charAt(Math.random() * CHARS_LEN);
        }
        console.log(`password has been changed for user ${user._id}/${email}, the new password is: ${verbalPassword}`);
        const password = this.encryptionService.getHashedPassword(verbalPassword);
        await this.userService.updateById(user._id, {password});
        const subject = serverConfig.brandName + ' support - reset password';
        const body = 'Your password has been reset.<br/><br/>Your new password is: ' + verbalPassword;
        // await this.mailService.send(email, subject, body);
        resolve();
      } catch (e) {
        this.loge('error in forgot password', email, e);
        reject(e);
      }
    });
  }
/*
  async resetPassword(email, token, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const decryptedEmail = this.encryptionService.decryptText(token || '');
        if (email !== decryptedEmail) {
          this.logwAndThrow('reset password - token/email mismatch', email, token, password);
        } else {
          const hashedPassword = this.encryptionService.getHashedPassword(password);
          const userDoc = await this.userService.updateOne({email}, {$set:{password: hashedPassword }}); // {new:true}
          if (!userDoc) this.logwAndThrow('reset password - document not found', email, token, password);
          resolve(userDoc);
        }
      } catch (e) {
        this.loge('error resetting password', e);
        reject(e);
      }
    });
  }
*/

  /***********************/
  /*   L O G I N         */
  /***********************/

  async validateUser(userName: string, password: string): Promise<any> {
    return new Promise<LocalStrategyResponse>(async(resolve, reject) => {
      let message = '';
      let user!: User;
      try {
        user = await this.userService.findOne({ userName });
        if (!user) {
          message = 'invalid user/password';
        } else if (user.status !== UserStatus.Active) {
          message = 'user status is inactive';
        } else if (!this.arePasswordsMatch(password, user.password)) {
          message = 'invalid user/password';
        }
      } catch (e) {
        this.loge('error validating user', e, userName, password);
        message = e.message;
      }
      resolve(message ? { isLoginSuccess: false, message } : { isLoginSuccess: true, user });
    });
  }

  getAuthProfile(user: User) {
    const props = ['firstName', 'lastName', 'email', 'role'];
    return ZObj.clone(user, props);
  }

  public arePasswordsMatch(password, hashedPassword) {
    return this.encryptionService.isPasswordMatchToHash(password, hashedPassword);
  }

  async getAccessToken(payload) {
    return this.jwtService.signAsync({ sub: payload }, { privateKey: serverConfig.auth.jwt.accessTokenSecretKey, expiresIn: serverConfig.auth.jwt.accessTokenExpiresIn });
  }

  async getRefreshToken(payload) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const opts = { expiresIn: serverConfig.auth.jwt.refreshTokenExpiresIn };
        jwt.sign(payload, serverConfig.auth.jwt.refreshTokenSecretKey, opts, (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        });
      } catch (e) {
        this.loge('error signing refresh token', e);
        reject(e);
      }
    });
  }

  async verifyRefreshToken(token) {
    return new Promise(async (resolve, reject) => {
      try {
        jwt.verify(token, serverConfig.auth.jwt.refreshTokenSecretKey, (err, decoded) => {
          if (err) {
            resolve(null);
          } else {
            resolve(decoded);
          }
        });
      } catch (e) {
        this.loge('error verifying refresh token', e);
        reject(e);
      }
    });
  }
}
