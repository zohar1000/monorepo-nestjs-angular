import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { ErrorService } from './shared/services/error.service';
import { FileService } from './shared/services/file.service';
import { SanitationService } from './shared/services/sanitation.service';
import { GlobalService } from './shared/services/global.service';
import { UserModule } from './routes/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { serverConfig } from './shared/consts/server-config';
import { User } from '@shared-all/models/entities/user.entity';
import { AuthModule } from './routes/auth/auth.module';

serverConfig.mongodb.entities = [User];

@Module({
  imports: [HttpModule, UserModule, AuthModule, TypeOrmModule.forRoot(serverConfig.mongodb)],
  controllers: [AppController],
  providers: [ErrorService, FileService, SanitationService]
})
export class AppModule {
  constructor(errorService: ErrorService, fileService: FileService, sanitationService: SanitationService) {
    GlobalService.globalService$.next({ errorService, fileService, sanitationService });
  }
}
