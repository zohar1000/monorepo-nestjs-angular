import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { serverConfig } from '@shared-server/consts/server-config';
import { JwtModule } from '@nestjs/jwt';
import { EncryptionService } from '@shared-server/services/encryption.service';
import { UserService } from '@shared-server/services/entities/user.service';
import { User } from '@shared-all/models/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: serverConfig.auth.jwt.accessTokenSecretKey,
      signOptions: { expiresIn: serverConfig.auth.jwt.accessTokenExpiresIn }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, EncryptionService, UserService]
})
export class AuthModule {}
