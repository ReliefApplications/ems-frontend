import { Observable } from 'rxjs';

/** enum of */
export enum ActionType {
  mapClick = 'map.click',
  addLayer = 'add.layer',
  removeLayer = 'remove.layer',
  addTab = 'add.tab',
  openTab = 'open.tab',
  removeTab = 'remove.tab',
  displayCollapse = 'display.collapse',
  displayExpand = 'display.expand',
  setContext = 'set.context',
  mapGetCountry = 'map.get.country',
}

export type ActionComponent = {
  component: 'trigger' | 'action';
  type: ActionType;
};

export type ActionValue = {
  widget?: any;
  layers?: any;
  tab?: any;
  tabs?: any;
  mapping?: string;
};

export type ActionWithValue = ActionComponent & {
  value?: ActionValue;
};

export type ActionWithProperties = ActionComponent & {
  properties?: {
    name: string;
    required?: boolean;
    type?: string;
    options?: {
      theme: string;
      language: string;
      fixedOverflowWidgets: boolean;
      formatOnPaste: boolean;
      automaticLayout: boolean;
    };
    editor: string;
    multiselect?: boolean;
    async?: boolean;
    choices?:
      | Observable<{ value: string; text: string }[]>
      | { value: string; text: string }[];
    onValueChanged?: (value: any) => void;
    onInit?: (value: any) => void;
  }[];
};
