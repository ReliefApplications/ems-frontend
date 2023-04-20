import { moduleMetadata, StoryObj, Meta } from '@storybook/angular';
import { TextareaComponent } from './textarea.component';
import { TextAreaModule } from '@progress/kendo-angular-inputs';

export default {
  title: 'TextareaComponent',
  component: TextareaComponent,
  decorators: [
    moduleMetadata({
      imports: [TextAreaModule],
    }),
  ],
  render: (args) => {
    return {
      args,
      template: `<ui-textarea
        [value]="'${args.value ?? ''}'" 
        [label]="'${args.label ?? ''}'"
        [placeholder]="'${args.placeholder ?? ''}'"
        [name]="'${args.name ?? ''}'"
        [dataBind]="'${args.dataBind ?? ''}'"
        ></ui-textarea>`,
      userDefinedTemplate: true,
    };
  },
} as Meta<TextareaComponent>;

export const TextArea: StoryObj<TextareaComponent> = {
  args: {
    value: 'Hi',
    label: 'Message',
    placeholder: 'Type something',
    name: 'textarea',
    dataBind: ''
  },
};