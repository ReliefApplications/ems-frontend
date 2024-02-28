/** Model for Widget automation rule. */
export interface WidgetAutomationRule {
  id: string;
  name: string;
  events: WidgetAutomationEvent[];
}

/** Model for Widget automation rule event item. */
export interface WidgetAutomationEvent {
  targetWidget: string;
  layers?: string[];
  event: any;
}
