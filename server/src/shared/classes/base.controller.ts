import { ServerResponse } from '@shared-all/models/server-response.model';
import { HttpException } from '@nestjs/common';
import { HttpStatusCodes } from '@shared-all/enums/http-status-codes.enum';
import { GlobalService } from '../services/global.service';
import { ErrorService } from '../services/error.service';
import { FileService } from '../services/file.service';
import { SanitationService } from '../services/sanitation.service';

export class BaseController {
  readonly DEFAULT_ERROR_CODE = HttpStatusCodes.DefaultError;
  protected errorService: ErrorService;
  protected fileService: FileService;
  protected sanitationService: SanitationService;

  constructor() {
    GlobalService.setGlobalServices(this);
  }

  successResponse(data?): ServerResponse {
		return { isSuccess: true, data };
	}

  errorResponse(message = ''): ServerResponse {
		return { isSuccess: false, error: { message } };
	}

  protected exceptionResponse(message, status = this.DEFAULT_ERROR_CODE) {
    // throw new HttpException({ status, error: message }, status);
    throw new HttpException(message, status);
  }

}
