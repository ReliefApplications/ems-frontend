/** Interface of breadcrumb */
export interface Breadcrumb {
  alias?: string;
  uri: string;
  text?: string;
  key?: string;
  queryParams?: any;
  showLabel: boolean;
}
