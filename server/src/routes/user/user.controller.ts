import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AddUserDto } from './dtos/add-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { BaseEntityController } from '@shared-server/classes/base-entity.controller';
import { GlobalService } from '@shared-server/services/global.service';
import { RoleGuard } from '@shared-server/guards/role.guard';
import { UserService } from '@shared-server/services/entities/user.service';
import { ServerResponse } from '@shared-all/models/server-response.model';
import { EntityServiceResponse } from '@shared-server/models/entity-service-response.model';
import { ItemGetPageDto } from './dtos/item-get-page.dto';

@Controller('/v1/user')
@UseGuards(RoleGuard)
@UseGuards(AuthGuard('jwt'))
export class UserController extends BaseEntityController {
  constructor(private readonly userService: UserService) {
    super('user', userService);
  }

  @Get('/temp1')
  async temp1() {
    try {
      const response = await this.entityService.temp1();
      return this.successResponse(response);
    } catch (e) {
      GlobalService.errorService.loge(`${this.constructor.name}: error getting page for ${this.entityName}`, e);
      return this.exceptionResponse(e.message);
    }
  }


  /*  @Get('/')
    async getAllUsers() {
      try {
        const response = {  message: 'ok!' };
        return this.successResponse(response);
      } catch (e) {
        return this.errorResponse(e.message);
      }
    }*/


  @Post('/items-page')
  async getUsersPage(@Request() req, @Body() body) {
    return await this.getItemsPage(req.user, body);
  }

  @Get('/')
  async getAllUsers(@Request() req) {
    try {
      const response: any[] = await this.userService.getProfiles(req.query);
      return this.successResponse(response);
    } catch (e) {
      this.errorService.loge('error getting user', e, req.query);
      return this.exceptionResponse(e.message);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id) {
    try {
      const profile = await this.userService.getProfileById(Number(id));
      return this.successResponse(profile);
    } catch (e) {
      this.errorService.loge('error getting user by id', id, e);
      return this.exceptionResponse(e.message);
    }
  }

  // @Post('/')
  // async addUser(@Request() req, @Body() dto: AddUserDto): Promise<ServerResponse | void> {
  //   try {
  //     const response: EntityServiceResponse = await this.userService.addUser(req.user, dto);
  //     if (!response.isSuccess) return this.errorResponse(response.message);
  //     return this.successResponse(response.data);
  //   } catch (e) {
  //     this.errorService.loge('error adding user', e, req, dto);
  //     return this.exceptionResponse(e.message);
  //   }
  // }

  // @Post('/add-page')
  // async addUserGetPage(@Request() req, @Body() dto: ItemGetPageDto): Promise<ServerResponse | void> {
  //   try {
  //     const itemResponse: EntityServiceResponse = await this.userService.addUser(req.user, dto.doc);
  //     if (!itemResponse.isSuccess) return this.errorResponse(itemResponse.message);
  //     const pageResponse: EntityServiceResponse = await this.getItemsPage(req.user, dto.getItemsRequest);
  //     if (!pageResponse.isSuccess) return this.errorResponse(pageResponse.message);
  //     pageResponse.data.insertedId = itemResponse.insertedId;
  //     return pageResponse;
  //   } catch (e) {
  //     this.errorService.loge('error adding user', e, req, dto);
  //     return this.exceptionResponse(e.message);
  //   }
  // }

  // @Put(':id')
  // async updateUser(@Request() req, @Param('id') id, @Body() dto: UpdateUserDto): Promise<ServerResponse | void> {
  //   try {
  //     const response: EntityServiceResponse = await this.userService.updateUser(req.user, Number(id), dto);
  //     if (!response.isSuccess) return this.errorResponse(response.message)
  //     return this.successResponse();
  //   } catch (e) {
  //     this.errorService.loge('error updating user', e, req, id, dto);
  //     return this.exceptionResponse(e.message);
  //   }
  // }

  // @Post(':id/edit-page')
  // async editUserGetPage(@Request() req, @Param('id') id, @Body() dto: ItemGetPageDto): Promise<ServerResponse | void> {
  //   try {
  //     const itemResponse: EntityServiceResponse = await this.userService.updateUser(req.user, Number(id), dto.doc);
  //     if (!itemResponse.isSuccess) return this.errorResponse(itemResponse.message)
  //     const pageResponse: EntityServiceResponse = await this.getItemsPage(req.user, dto.getItemsRequest);
  //     if (!pageResponse.isSuccess) return this.errorResponse(pageResponse.message);
  //     return pageResponse;
  //   } catch (e) {
  //     this.errorService.loge('error updating user', e, req, dto);
  //     return this.exceptionResponse(e.message);
  //   }
  // }

  // @Delete(':id')
  // async deleteUser(@Request() req, @Param('id') id): Promise<ServerResponse | void> {
  //   try {
  //     const response: EntityServiceResponse = await this.userService.deleteUser(req.user, Number(id));
  //     if (!response.isSuccess) return this.errorResponse(response.message);
  //     return this.successResponse();
  //   } catch (e) {
  //     this.errorService.loge('error deleting user', e, req, id);
  //     return this.exceptionResponse(e.message);
  //   }
  // }

  // @Post(':id/delete-page')
  // async deleteUserGetPage(@Request() req, @Param('id') id, @Body() dto: ItemGetPageDto): Promise<ServerResponse | void> {
  //   try {
  //     const itemResponse: EntityServiceResponse = await this.userService.deleteUser(req.user, Number(id));
  //     if (!itemResponse.isSuccess) return this.errorResponse(itemResponse.message);
  //     const pageResponse: EntityServiceResponse = await this.getItemsPage(req.user, dto.getItemsRequest);
  //     if (!pageResponse.isSuccess) return this.errorResponse(pageResponse.message);
  //     return pageResponse;
  //   } catch (e) {
  //     this.errorService.loge('error deleting user', e, req, dto);
  //     return this.exceptionResponse(e.message);
  //   }
  // }
}
