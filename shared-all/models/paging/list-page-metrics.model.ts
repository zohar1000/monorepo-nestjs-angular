import { PagingMetrics } from '@shared-all/models/paging/paging-metrics.model';
import { SortMetrics } from '@shared-all/models/paging/sort-metrics.model';

export interface ListPageMetrics {
  filter: any;
  paging: PagingMetrics;
  sort: SortMetrics;
}

