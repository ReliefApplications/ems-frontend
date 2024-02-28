/** Model for Widget automation object. */
export interface WidgetAutomation {
  id?: string;
  name?: string;
  targetWidget: string;
  layers?: string[];
  event: any;
}
