import { ZObj } from 'zshared';
import { Injectable } from '@nestjs/common';
import { EncryptionService } from '../encryption.service';
import { AddUserDto } from '../../../routes/user/dtos/add-user.dto';
import { UpdateUserDto } from '../../../routes/user/dtos/update-user.dto';
import { BaseEntityService } from '../../classes/base-entity.service';
import { AuthUser } from '../../models/auth-user.model';
import { EntityServiceResponse } from '../../models/entity-service-response.model';
import { RoleRate } from '@shared-all/consts/role-rate.const';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@shared-all/models/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '@shared-all/enums/role.enum';

@Injectable()
export class UserService extends BaseEntityService {
  readonly FIRST_USER_ID = 101;

  constructor(@InjectRepository(User) repository: Repository<User>, private readonly encryptionService: EncryptionService) {
    super('user', repository);
  }

  getEntitySelectedFields() {
    return {
      _id: true,
      userName: true,
      email: true,
      status: true,
      role: true,
      firstName: true,
      lastName: true
    }
  }

/*
  async addUser(authUser: AuthUser, dto: AddUserDto) {
    return new Promise<EntityServiceResponse>(async (resolve, reject) => {
      try {
        if (RoleRate[authUser.role] < RoleRate[dto.role]) {
          resolve({ isSuccess: false, message: appText$.value.errors.cannotOperateOnHigherRole });
          return;
        }
        let userDoc: UserDoc = await this.findByEmail(dto.email);
        if (userDoc) {
          resolve({ isSuccess: false, message: appText$.value.errors.alreadyUsedEmail });
          return;
        }
        userDoc = {
          firstName: dto.firstName || '',
          lastName: dto.lastName || '',
          email: dto.email,
          role: dto.role,
          status: dto.status,
          password: this.encryptionService.getHashedPassword(dto.password),
          lastLoginTime: 0
        };
        const response = await this.mongoService.insertOneAutoIncrement(this.FIRST_USER_ID, this.collectionName, userDoc) as ZMongoInsertOneResponse;
        resolve({ isSuccess: true, data: this.getProfileFromDoc(userDoc), insertedId: response['insertedId'] });
      } catch (e) {
        this.logi('error adding user', e);
        reject(e);
      }
    });
  }

  async updateUser(authUser: AuthUser, userId, dto: UpdateUserDto) {
    return new Promise<EntityServiceResponse>(async (resolve, reject) => {
      try {
        const callerRoleRate = RoleRate[authUser.role];
        if (dto.role && callerRoleRate < RoleRate[dto.role]) {
          resolve({ isSuccess: false, message: appText$.value.errors.cannotOperateOnHigherRole });
          return;
        }
        const userDoc: UserDoc = await this.findById(userId);
        if (!userDoc) this.throw(ztranslate(appText$.value.errors.itemDoesNotExist, { item: this.entityName }));
        if (callerRoleRate < RoleRate[userDoc.role]) {
          resolve({ isSuccess: false, message: appText$.value.errors.cannotOperateOnHigherRole });
          return;
        }
        const fields: any = ZObj.clone(dto);
        if (fields.password) {
          fields.password = this.encryptionService.getHashedPassword(fields.password);
        } else {
          delete fields.password;
        }
        await this.updateById(userId, fields);
        resolve({ isSuccess: true });
      } catch (e) {
        this.loge('error trying to update user record', e, userId, dto);
        reject(e);
      }
    });
  }

  async deleteUser(authUser: AuthUser, userId) {
    return new Promise<EntityServiceResponse>(async (resolve, reject) => {
      try {
        const callerRoleRate = RoleRate[authUser.role];
        const userDoc: UserDoc = await this.findById(userId);
        if (!userDoc) {
          resolve({ isSuccess: false, message: ztranslate(appText$.value.errors.itemDoesNotExist, { item: this.entityName }) });
          return;
        }
        if (callerRoleRate < RoleRate[userDoc.role]) {
          resolve({ isSuccess: false, message: appText$.value.errors.cannotOperateOnHigherRole });
          return;
        }
        await this.deleteById(userId);
        resolve({ isSuccess: true });
      } catch (e) {
        this.loge('error trying to delete user record', e, userId, authUser);
        reject(e);
      }
    });
  }
*/

  /**********************/
  /*   U T I L S        */
  /**********************/

  async findByEmail(email: string): Promise<any | null> {
    let doc;
    try {
      doc = await this.findOne({ email });
    } catch (e) {}
    return doc;
  }
}
