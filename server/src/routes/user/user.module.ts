import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '@shared-server/services/entities/user.service';
import { EncryptionService } from '@shared-server/services/encryption.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@shared-all/models/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, EncryptionService]
})
export class UserModule {}
