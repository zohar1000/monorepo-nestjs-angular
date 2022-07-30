import { ListPageMetrics } from '@shared-all/models/paging/list-page-metrics.model';

export interface GetItemsRequest extends ListPageMetrics {
  isTotalCount: boolean;
}

