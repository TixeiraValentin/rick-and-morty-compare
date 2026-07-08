/** A generic paginated result, decoupled from the API's `info`/`results` shape. */
export interface PageInfo {
  count: number;
  pages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Page<T> {
  items: T[];
  info: PageInfo;
}
