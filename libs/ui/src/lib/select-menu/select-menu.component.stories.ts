import { addons } from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectMenuComponent } from './select-menu.component';
import { CdkListboxModule } from '@angular/cdk/listbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'SelectMenu',
  component: SelectMenuComponent,
  argTypes: {
    selectTriggerTemplate: {
      defaultValue: 'Choose an option',
      type: 'string',
    },
    disabled: {
      defaultValue: false,
      type: 'boolean',
    },
    required: {
      defaultValue: false,
      type: 'boolean',
    },
    multiselect: {
      defaultValue: false,
      type: 'boolean',
    },
    options: {
      defaultValue: ['first option', 'second option'],
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        CdkListboxModule,
        BrowserAnimationsModule,
      ],
    }),
  ],
} as Meta<SelectMenuComponent>;

let isOpened = false;
let isClosed = false;
let selection: any[] = [];

/**
 *
 * @param event
 */
const openEvent = (event: any) => {
  isOpened = event;
  console.log('isOpened : ' + isOpened);
  addons.getChannel().emit(FORCE_RE_RENDER);
};
/**
 *
 * @param event
 */
const closeEvent = (event: any) => {
  isClosed = event;
  console.log('isClosed : ' + isClosed);
  addons.getChannel().emit(FORCE_RE_RENDER);
};
/**
 *
 * @param event
 */
const selectEvent = (event: any) => {
  selection = event;
  console.log(selection);
  addons.getChannel().emit(FORCE_RE_RENDER);
};

/**
 *
 */
const selectMenuTemplate = `<div [formGroup]="formGroup" class="py-5">
<ui-select-menu (opened)="openEvent($event)" (closed)="closeEvent($event)" (selectedOption)="selectEvent($event)" formControlName="selectMenu" [selectTriggerTemplate]="selectTriggerTemplate" [options]="options" [multiselect]="multiselect" [disabled]="disabled" name="externalVal"></ui-select-menu>
</div>
<br>
<p>value: {{formGroup.get('selectMenu').value}}</p>
<p>touched: {{formGroup.get('selectMenu').touched}}</p>
<p *ngIf="isOpened"> Select Menu is opened </p>
<p *ngIf="isClosed"> Select Menu is closed </p>
<p>selection (from event) : </p>
<a *ngFor="let item of selection">{{item}}, </a>
`;

/**
 *
 */
const selectMenuTemplateWithTrigger = `<div [formGroup]="formGroup" class="py-5">
<ui-select-menu (opened)="openEvent($event)" (closed)="closeEvent($event)" (selectedOption)="selectEvent($event)" formControlName="selectMenu" [selectTriggerTemplate]="selectTriggerTemplateTest" [options]="options" [multiselect]="multiselect" [disabled]="disabled" name="externalVal"></ui-select-menu>
</div>
<br>
<p>value: {{formGroup.get('selectMenu').value}}</p>
<p>touched: {{formGroup.get('selectMenu').touched}}</p>
<p *ngIf="isOpened"> Select Menu is opened </p>
<p *ngIf="isClosed"> Select Menu is closed </p>
<p>selection (from event) : </p>
<a *ngFor="let item of selection">{{item}}, </a>
<ng-template #selectTriggerTemplateTest><div class="text-red-600">Choose your language</div></ng-template>
`;

/**
 * Form group to test select-menu control value accessor
 */
const formGroup = new FormGroup({
  selectMenu: new FormControl(['test']),
});

/**
 *
 * @param args
 */
const TemplateStandaloneSelection: Story<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  args.options = [
    'french',
    'english',
    'japanese',
    'javanese',
    'polish',
    'german',
    'spanish',
    'dutch',
    'chinese',
  ];
  args.multiselect = false;
  args.disabled = false;
  args.selectTriggerTemplate = 'Choose your language';
  return {
    component: SelectMenuComponent,
    template: selectMenuTemplate,
    props: {
      ...args,
      formGroup,
      isClosed,
      isOpened,
      selection,
      selectEvent,
      openEvent,
      closeEvent,
    },
  };
};
/**
 *
 */
export const StandaloneSelection = TemplateStandaloneSelection.bind({});

/**
 *
 * @param args
 */
const TemplateMultiSelection: Story<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  args.options = [
    'french',
    'english',
    'japanese',
    'javanese',
    'polish',
    'german',
    'spanish',
    'dutch',
    'chinese',
  ];
  args.multiselect = true;
  args.disabled = false;
  args.selectTriggerTemplate = 'Choose your language';
  return {
    component: SelectMenuComponent,
    template: selectMenuTemplate,
    props: {
      ...args,
      formGroup,
      isClosed,
      isOpened,
      selection,
      selectEvent,
      openEvent,
      closeEvent,
    },
  };
};
/**
 *
 */
export const MultiSelection = TemplateMultiSelection.bind({});

/**
 *
 * @param args
 */
const TemplateDisabledSelection: Story<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  args.options = [
    'french',
    'english',
    'japanese',
    'javanese',
    'polish',
    'german',
    'spanish',
    'dutch',
    'chinese',
  ];
  args.multiselect = false;
  args.disabled = true;
  args.selectTriggerTemplate = 'Choose your language';
  return {
    component: SelectMenuComponent,
    template: selectMenuTemplate,
    props: {
      ...args,
      formGroup,
      isClosed,
      isOpened,
      selection,
      selectEvent,
      openEvent,
      closeEvent,
    },
  };
};
/**
 *
 */
export const DisabledSelection = TemplateDisabledSelection.bind({});

/**
 *
 * @param args
 */
const TemplateTemplateRefSelection: Story<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  args.options = [
    'french',
    'english',
    'japanese',
    'javanese',
    'polish',
    'german',
    'spanish',
    'dutch',
    'chinese',
  ];
  args.multiselect = false;
  args.disabled = false;
  args.selectTriggerTemplate =
    '<ng-template #selectTriggerTemplate><div class="text-red-600">Choose your language</div></ng-template>';
  return {
    component: SelectMenuComponent,
    template: selectMenuTemplateWithTrigger,
    props: {
      ...args,
      formGroup,
      isClosed,
      isOpened,
      selection,
      selectEvent,
      openEvent,
      closeEvent,
    },
  };
};
/**
 *
 */
export const TemplateRefSelection = TemplateTemplateRefSelection.bind({});

/**
 *
 * @param args
 */
const TemplateDifferentObjectsSelection: Story<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  args.options = [new Date(), 12, 'I am a string', 22.1, true];
  args.multiselect = true;
  args.disabled = false;
  args.selectTriggerTemplate = 'Many different objects';
  return {
    component: SelectMenuComponent,
    template: selectMenuTemplate,
    props: {
      ...args,
      formGroup,
      isClosed,
      isOpened,
      selection,
      selectEvent,
      openEvent,
      closeEvent,
    },
  };
};
/**
 *
 */
export const DifferentObjectsSelection = TemplateDifferentObjectsSelection.bind(
  {}
);
