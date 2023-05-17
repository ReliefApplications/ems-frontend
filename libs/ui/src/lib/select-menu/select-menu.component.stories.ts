import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectMenuComponent } from './select-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectOptionModule } from './components/select-option.module';

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
  },
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SelectOptionModule,
      ],
    }),
  ],
} as Meta<SelectMenuComponent>;

/** Options for select menu */
const options = [
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

/**
 * Used to test if emission of output "opened" works
 */
const openEvent = () => {
  console.log('isOpened');
};
/**
 * Used to test if emission of output "closed" works
 */
const closeEvent = () => {
  console.log('isClosed');
};
/**
 * Used to test if emission of output "selectedOption" works
 *
 * @param event output
 */
const selectEvent = (event: any) => {
  console.log('Select Event: ', event);
  console.log('Form control: ', formGroup.get('selectMenu')?.value);
};

/** Select with no custom template */
const selectTemplate = `<ui-select-menu 
  formControlName="selectMenu"
  (opened)="openEvent($event)" 
  (closed)="closeEvent($event)" 
  (selectedOption)="selectEvent($event)" 
  [multiselect]="multiselect"
  [disabled]="disabled">
  <ui-select-option *ngFor="let option of options" [value]="option">
    {{option}}
  </ui-select-option>
</ui-select-menu>`;

/** Custom template trigger to be placed between the select tag */
const customTriggerSelect = `
<ng-template #customTemplate>
<span class="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">{{formGroup.get('selectMenu').value}}</span>
</ng-template>`;

/** Select with the custom template trigger placed between the select tag */
const customTriggerSelectTemplate = `<ui-select-menu
  formControlName="selectMenu"
  (opened)="openEvent($event)" 
  (closed)="closeEvent($event)" 
  (selectedOption)="selectEvent($event)"
  [multiselect]="multiselect"
  [disabled]="disabled"
  [customTemplate]="customTemplate"
>
  ${customTriggerSelect}
  <ui-select-option *ngFor="let option of options" [value]="option">
    {{option}}
  </ui-select-option>
</ui-select-menu>`;

/** Template used to render the stories (using a formGroup) */
const selectMenuTemplate = `<div [formGroup]="formGroup" class="py-5">
${selectTemplate}
</div>
`;

/** Template used to render the stories (using a formGroup with pre-selected values) */
const formControlSelectTemplate = `
<div [formGroup]="formGroup" class="py-5">
  <ui-select-menu 
    formControlName="selectMenu"
    (opened)="openEvent($event)" 
    (closed)="closeEvent($event)" 
    (selectedOption)="selectEvent($event)" 
    [multiselect]="multiselect"
  >
    <ui-select-option
      *ngFor="let option of options"
      [value]="option"
      [selected]="formGroup.get('selectMenu')?.value.includes(option)">
      {{option}}
    </ui-select-option>
  </ui-select-menu>
</div>
`;

/**
 * Template used to render the stories (using a formGroup) and use of a ngTemplate as selectTriggerTemplate input
 */
const singleSelectMenuTemplateWithTrigger = `<div [formGroup]="formGroup" class="py-5">
${customTriggerSelectTemplate}
</div>
`;

/** Form group to test select-menu control value accessor */
const formGroup = new FormGroup({
  selectMenu: new FormControl(),
});

/**
 * Template for standalone selection select menu
 *
 * @param args args
 * @returns story of select menu component
 */
const TemplateStandaloneSelection: StoryFn<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  formGroup.get('selectMenu')?.setValue([]);
  return {
    component: SelectMenuComponent,
    template: selectMenuTemplate,
    props: {
      ...args,
      options,
      formGroup,
      selectEvent,
      openEvent,
      closeEvent,
    },
  };
};
/** Actual export of standalone select story */
export const StandaloneSelection = TemplateStandaloneSelection.bind({});
StandaloneSelection.args = {
  multiselect: false,
  disabled: false,
};

/**
 * Template for standalone selection default value select menu
 *
 * @param args args
 * @returns story of select menu component
 */
const TemplateStandaloneSelectionDefaultValue: StoryFn<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  formGroup.get('selectMenu')?.setValue([options[0]]);
  return {
    component: SelectMenuComponent,
    template: formControlSelectTemplate,
    props: {
      ...args,
      options,
      formGroup,
      selectEvent,
      openEvent,
      closeEvent,
    },
  };
};
/** Actual export of standalone select story */
export const StandaloneSelectionDefaultValue =
  TemplateStandaloneSelectionDefaultValue.bind({});
StandaloneSelectionDefaultValue.args = {
  multiselect: false,
  disabled: false,
};

/**
 * Template for multi selection select menu
 *
 * @param args args
 * @returns story of select menu component
 */
const TemplateMultiSelection: StoryFn<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  args.multiselect = true;
  formGroup.get('selectMenu')?.setValue([options[0], options[1]]);
  return {
    component: SelectMenuComponent,
    template: formControlSelectTemplate,
    props: {
      ...args,
      options,
      formGroup,
      selectEvent,
      openEvent,
      closeEvent,
    },
  };
};
/** Actual export of multi select story */
export const MultiSelection = TemplateMultiSelection.bind({});
MultiSelection.args = {
  multiselect: true,
  disabled: false,
};

/**
 * Template for disabled selection select menu
 *
 * @param args args
 * @returns story of select menu component
 */
const TemplateDisabledSelection: StoryFn<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  args.disabled = true;
  return {
    component: SelectMenuComponent,
    template: selectMenuTemplate,
    props: {
      ...args,
      options,
      formGroup,
      selectEvent,
      openEvent,
      closeEvent,
    },
  };
};
/** Actual export of disabled select story */
export const DisabledSelection = TemplateDisabledSelection.bind({});
MultiSelection.args = {
  disabled: true,
};

/**
 * Template for single select menu using a ngTemplate as input
 *
 * @param args args
 * @returns story of select menu component
 */
const TemplateTemplateRefSelection: StoryFn<SelectMenuComponent> = (
  args: SelectMenuComponent
) => {
  formGroup.get('selectMenu')?.setValue([options[0]]);
  return {
    component: SelectMenuComponent,
    template: singleSelectMenuTemplateWithTrigger,
    props: {
      ...args,
      options,
      formGroup,
      selectEvent,
      openEvent,
      closeEvent,
    },
  };
};
/** Actual export of select story using ngTemplate as input */
export const TemplateRefSelection = TemplateTemplateRefSelection.bind({});
TemplateRefSelection.args = {
  multiselect: false,
  disabled: false,
};
