import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectMenuComponent } from './select-menu.component';
import { CdkListboxModule } from '@angular/cdk/listbox';

export default {
  title: 'SelectMenu',
  component: SelectMenuComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule, CdkListboxModule],
    }),
  ],
} as Meta<SelectMenuComponent>;

const selectMenuTemplate = `<div [formGroup]="formGroup" class="py-5">
<ui-select-menu formControlName="selectMenu" [selectTriggerTemplate]="selectTriggerTemplate" [options]="options" [multiselect]="multiselect" [disabled]="disabled" name="externalVal"></ui-select-menu>
</div>
<br>
<p>value: {{formGroup.get('selectMenu').value}}</p>
<p>touched: {{formGroup.get('selectMenu').touched}}</p>
`;

/**
 * Form group to test select-menu control value accessor
 */
const formGroup = new FormGroup({
  selectMenu: new FormControl(['test']),
});

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
    },
  };
};
export const StandaloneSelection = TemplateStandaloneSelection.bind({});

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
    },
  };
};
export const MultiSelection = TemplateMultiSelection.bind({});

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
    },
  };
};
export const DisabledSelection = TemplateDisabledSelection.bind({});

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
    '<ng-template><div class="text-red-600">Choose your language</div></ng-template>';
  return {
    component: SelectMenuComponent,
    template: selectMenuTemplate,
    props: {
      ...args,
      formGroup,
    },
  };
};
export const TemplateRefSelection = TemplateTemplateRefSelection.bind({});
