import { AuthUser } from '../models/auth-user.model';
import { BaseController } from './base.controller';
import { HttpStatusCodes } from '@shared-all/enums/http-status-codes.enum';
import { EntityServiceResponse } from '../models/entity-service-response.model';
import { GetItemsResponse } from '@shared-all/models/paging/get-items-response.model';
import { GlobalService } from '../services/global.service';

export abstract class BaseEntityController extends BaseController {
  readonly DEFAULT_ERROR_CODE = HttpStatusCodes.DefaultError;

  protected constructor(protected entityName = '', protected entityService) {
    super();
  }

  async getItemsPage(user: AuthUser, body): Promise<EntityServiceResponse> {
    try {
      const response: GetItemsResponse = await this.entityService.getItemsPage(user, body);
      return { isSuccess: true, data: response };
    } catch (e) {
      GlobalService.errorService.loge(`${this.constructor.name}: error getting page for ${this.entityName}`, e, user, body);
      return { isSuccess: false, message: e.message };
    }
  }
}
