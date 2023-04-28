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
  // Defines the controls
  argTypes: {
    selectTriggerTemplate: {
      defaultValue: 'Choose an option',
      type: 'string',
      control: { type: 'string' },
    },
    disabled: {
      defaultValue: false,
      type: 'boolean',
      control: { type: 'boolean' },
    },
    required: {
      defaultValue: false,
      type: 'boolean',
      control: { type: 'boolean' },
    },
    multiselect: {
      defaultValue: false,
      type: 'boolean',
      control: { type: 'boolean' },
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

// Used to test outputs
let isOpened = false;
let isClosed = false;
let selection: any[] = [];

/**
 * Used to test if emission of output "opened" works
 *
 * @param event output
 */
const openEvent = (event: any) => {
  isOpened = event;
  console.log('isOpened : ' + isOpened);
  addons.getChannel().emit(FORCE_RE_RENDER);
};
/**
 * Used to test if emission of output "closed" works
 *
 * @param event output
 */
const closeEvent = (event: any) => {
  isClosed = event;
  console.log('isClosed : ' + isClosed);
  addons.getChannel().emit(FORCE_RE_RENDER);
};
/**
 * Used to test if emission of output "selectedOption" works
 *
 * @param event output
 */
const selectEvent = (event: any) => {
  selection = event;
  console.log(selection);
  addons.getChannel().emit(FORCE_RE_RENDER);
};

/**
 * Template used to render the stories (using a formGroup)
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
 * Template used to render the stories (using a formGroup) and use of a ngTemplate as selectTriggerTemplate input
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
<ng-template #selectTriggerTemplateTest><div class="text-red-600">I am a custom template</div></ng-template>
`;

/**
 * Form group to test select-menu control value accessor
 */
const formGroup = new FormGroup({
  selectMenu: new FormControl(['']),
});

/**
 * Template for standalone selection select menu
 *
 * @param args args
 * @returns story of select menu component
 */
const TemplateStandaloneSelection: Story<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  args.options = [
    'French',
    'English',
    'Japanese',
    'Javanese',
    'Polish',
    'German',
    'Spanish',
    'Dutch',
    'Chinese',
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
 * Actual export of standalone select story
 */
export const StandaloneSelection = TemplateStandaloneSelection.bind({});

/**
 * Template for multi selection select menu
 *
 * @param args args
 * @returns story of select menu component
 */
const TemplateMultiSelection: Story<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  args.options = [
    'French',
    'English',
    'Japanese',
    'Javanese',
    'Polish',
    'German',
    'Spanish',
    'Dutch',
    'Chinese',
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
 * Actual export of multi select story
 */
export const MultiSelection = TemplateMultiSelection.bind({});

/**
 * Template for disabled selection select menu
 *
 * @param args args
 * @returns story of select menu component
 */
const TemplateDisabledSelection: Story<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  args.options = [
    'French',
    'English',
    'Japanese',
    'Javanese',
    'Polish',
    'German',
    'Spanish',
    'Dutch',
    'Chinese',
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
 * Actual export of disabled select story
 */
export const DisabledSelection = TemplateDisabledSelection.bind({});

/**
 * Template for select menu using a ngTemplate as input
 *
 * @param args args
 * @returns story of select menu component
 */
const TemplateTemplateRefSelection: Story<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  args.options = [
    'French',
    'English',
    'Japanese',
    'Javanese',
    'Polish',
    'German',
    'Spanish',
    'Dutch',
    'Chinese',
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
 * Actual export of select story using ngTemplate as input
 */
export const TemplateRefSelection = TemplateTemplateRefSelection.bind({});

/**
 * Date in order to test different objects in option list
 */
const testDate = new Date();

/**
 * Template for different objects selection select menu
 *
 * @param args args
 * @returns story of select menu component
 */
const TemplateDifferentObjectsSelection: Story<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  args.options = [testDate, 12, 'I am a string', 22.1, true];
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
 * Actual export of select story using many different objects as input
 */
export const DifferentObjectsSelection = TemplateDifferentObjectsSelection.bind(
  {}
);
