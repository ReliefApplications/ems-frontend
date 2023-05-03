import { addons } from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectMenuComponent } from './select-menu.component';
import { CdkListboxModule } from '@angular/cdk/listbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'Select Menu',
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
let selection: any[] = [];

/**
 * Used to test if emission of output "opened" works
 */
const openEvent = () => {
  console.log('isOpened');
  addons.getChannel().emit(FORCE_RE_RENDER);
};
/**
 * Used to test if emission of output "closed" works
 */
const closeEvent = () => {
  console.log('isClosed');
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
 * Select with no custom template
 */
const selectTemplate = `<ui-select-menu 
formControlName="selectMenu"
(opened)="openEvent($event)" 
(closed)="closeEvent($event)" 
(selectedOption)="selectEvent($event)" 
[label]="label" 
[options]="options"
[multiselect]="multiselect"
[disabled]="disabled">
</ui-select-menu>`;

/**
 * Custom template trigger to be placed between the select tag
 */
const customTriggerSelect = `<selectTriggerTemplate>
<ng-container *ngTemplateOutlet="otherTemplate"></ng-container>
</selectTriggerTemplate>
<ng-template #otherTemplate>
<div class="text-red-600">
{{formGroup.get('selectMenu').value?.[0]}}
<span *ngIf="(formGroup.get('selectMenu').value?.length || 0) > 1" class="example-additional-selection">
(+{{(formGroup.get('selectMenu').value?.length || 0) - 1}} {{formGroup.get('selectMenu').value?.length === 2 ? 'other' : 'others'}})
</span>
</div>
</ng-template>`;

/**
 * Select with the custom template trigger placed between the select tag
 */
const customTriggerSelectTemplate = `<ui-select-menu 
formControlName="selectMenu"
(opened)="openEvent($event)" 
(closed)="closeEvent($event)" 
(selectedOption)="selectEvent($event)" 
[label]="label" 
[options]="options"
[multiselect]="multiselect"
[disabled]="disabled">
${customTriggerSelect}
</ui-select-menu>`;

/**
 * Template used to render the stories (using a formGroup)
 */
const selectMenuTemplate = `<div [formGroup]="formGroup" class="py-5">
${selectTemplate}
</div>
<br>
<p>value: {{formGroup.get('selectMenu').value}}</p>
<p>touched: {{formGroup.get('selectMenu').touched}}</p>
<p class="inline">selection (from event) : </p>
<span *ngFor="let item of selection">{{item}}, </span>
`;

/**
 * Template used to render the stories (using a formGroup) and use of a ngTemplate as selectTriggerTemplate input
 */
const singleSelectMenuTemplateWithTrigger = `<div [formGroup]="formGroup" class="py-5">
${customTriggerSelectTemplate}
</div>
<br>
<p>value: {{formGroup.get('selectMenu').value}}</p>
<p>touched: {{formGroup.get('selectMenu').touched}}</p>
<p class="inline">selection (from event) : </p>
<span *ngFor="let item of selection">{{item}}, </span>
`;

/**
 * Form group to test select-menu control value accessor
 */
const formGroup = new FormGroup({
  selectMenu: new FormControl(),
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
  args.label = 'Choose your language';
  return {
    component: SelectMenuComponent,
    template: selectMenuTemplate,
    props: {
      ...args,
      formGroup,
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
 * Template for standalone selection default value select menu
 *
 * @param args args
 * @returns story of select menu component
 */
const TemplateStandaloneSelectionDefaultValue: Story<SelectMenuComponent> = (
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
  args.label = 'Choose your language';
  formGroup.get('selectMenu')?.setValue([args.options[0]]);
  return {
    component: SelectMenuComponent,
    template: selectMenuTemplate,
    props: {
      ...args,
      formGroup,
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
export const StandaloneSelectionDefaultValue =
  TemplateStandaloneSelectionDefaultValue.bind({});

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
  args.label = 'Choose your language';
  return {
    component: SelectMenuComponent,
    template: selectMenuTemplate,
    props: {
      ...args,
      formGroup,
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
  args.disabled = true;
  args.label = 'Choose your language';
  return {
    component: SelectMenuComponent,
    template: selectMenuTemplate,
    props: {
      ...args,
      formGroup,
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
  args.label = 'Choose your language';
  return {
    component: SelectMenuComponent,
    template: singleSelectMenuTemplateWithTrigger,
    props: {
      ...args,
      formGroup,
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
 * Template for select menu using a ngTemplate as input
 *
 * @param args args
 * @returns story of select menu component
 */
const TemplateTemplateRefSelectionDefaultValue: Story<SelectMenuComponent> = (
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
  args.label = 'Choose your language';
  formGroup.get('selectMenu')?.setValue([args.options[0]]);
  return {
    component: SelectMenuComponent,
    template: singleSelectMenuTemplateWithTrigger,
    props: {
      ...args,
      formGroup,
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
export const TemplateRefSelectionDefaultValue =
  TemplateTemplateRefSelectionDefaultValue.bind({});

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
  args.label = 'Many different objects';
  return {
    component: SelectMenuComponent,
    template: selectMenuTemplate,
    props: {
      ...args,
      formGroup,
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
