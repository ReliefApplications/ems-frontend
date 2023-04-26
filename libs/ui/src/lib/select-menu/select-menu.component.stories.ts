import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SelectMenuComponent } from './select-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectMenuModule } from './select-menu.module';
import { CdkListboxModule } from '@angular/cdk/listbox';

export default {
  title: 'SelectMenuComponent',
  component: SelectMenuComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SelectMenuModule,
        ReactiveFormsModule,
        CdkListboxModule,
        FormsModule,
      ],
    }),
  ],
} as Meta<SelectMenuComponent>;

const Template: Story<SelectMenuComponent> = (args: SelectMenuComponent) => ({
  props: args,
  template:
    '<ui-select-menu [options]="options" [multiselect]="multiselect" [disabled]="disabled" [(ngModel)]="external" name="externalVal"></ui-select-menu><div class="flex">Selection ngModel: {{external}}</div>',
});

export const StandaloneSelection = Template.bind({});
StandaloneSelection.args = {
  options: ['french', 'english', 'japanese', 'javanese'],
  multiselect: false,
  disabled: false,
};

export const MultiSelection = Template.bind({});
MultiSelection.args = {
  options: ['french', 'english', 'japanese', 'javanese'],
  multiselect: true,
  disabled: false,
};

export const DisabledSelection = Template.bind({});
DisabledSelection.args = {
  options: ['french', 'english', 'japanese', 'javanese'],
  multiselect: false,
  disabled: true,
};
