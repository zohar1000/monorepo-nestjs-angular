import { GetItemsRequest } from '@shared-all/models/paging/get-items-request.model';

export class ItemGetPageDto {
  readonly doc: any;
  readonly getItemsRequest: GetItemsRequest;
}
