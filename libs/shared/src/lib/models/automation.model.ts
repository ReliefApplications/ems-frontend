export type AutomationTriggerComponent = {
  component: 'trigger';
  type: 'click';
};

type AutomationRemoveLayerActionComponent = {
  component: 'action';
  type: 'remove.layer';
};

type AutomationAddLayerActionComponent = {
  component: 'action';
  type: 'add.layer';
};

export type AutomationActionComponent =
  | AutomationRemoveLayerActionComponent
  | AutomationAddLayerActionComponent;
