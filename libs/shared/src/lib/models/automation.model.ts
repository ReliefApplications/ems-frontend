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
  event: AutomationEvents;
}
/** Type of automation events */
const AUTOMATION_EVENTS = ['expand', 'collapse', 'hide', 'show'];
export type AutomationEvents = (typeof AUTOMATION_EVENTS)[number];
