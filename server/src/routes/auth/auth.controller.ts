import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { UserService } from '@shared-server/services/entities/user.service';
import { LoginDto } from './dtos/login.dto';
import { BaseEntityController } from '@shared-server/classes/base-entity.controller';
import { ServerResponse } from '@shared-all/models/server-response.model';
import { ServerLoginResponse } from '@shared-all/models/server-login-response.model';
import { RefreshTokenResponse } from '@shared-all/models/refresh-token-response.model';
import { LocalStrategyResponse } from '@shared-all/models/local-strategy-response.model';
import { Role } from '@shared-all/enums/role.enum';
import { UserStatus } from './enums/user-status.enum';

@Controller('/v1/auth')
export class AuthController extends BaseEntityController {
  constructor(private readonly authService: AuthService,
              private readonly userService: UserService) {
    super('auth', authService);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('permissions')
  async permissions(@Request() req): Promise<ServerResponse | void> {
    try {
      const userProfile = await this.authService.permissions(req.user);
      return this.successResponse(userProfile);
    } catch (e) {
      return this.exceptionResponse(e.message, 401);
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() dto: LoginDto): Promise<ServerResponse> {
    try {
      const response: ServerLoginResponse = await this.authService.login(dto, req.user as LocalStrategyResponse);
      if (!response.isSuccess) return this.errorResponse(response.message);
      return this.successResponse(response);
    } catch (e) {
      return this.errorResponse(e.message);
    }
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  async refresh(@Body() body): Promise<ServerResponse> {
    try {
      const response: RefreshTokenResponse = await this.authService.refresh(body.refreshToken);
      if (!response.isSuccess) return this.errorResponse();
      return this.successResponse(response);
    } catch (e) {
      // return this.exceptionResponse(e.message, 401);
      return this.errorResponse();
    }
  }
/*
  @Post('forgot-password')
  async forgotPassword(@Body() body) {
    try {
      await this.authService.forgotPassword(body.email);
      return this.successResponse();
    } catch (e) {
      this.errorService.loge('error in forgot password at controller', e, body);
      return this.errorResponse(e.message);
    }
  }
*/
}
