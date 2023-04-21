import { moduleMetadata, StoryObj, Meta } from '@storybook/angular';
import { TextareaComponent } from './textarea.component';
import { TextareaModule } from './textarea.module';

export default {
  title: 'TextareaComponent',
  component: TextareaComponent,
  decorators: [
    moduleMetadata({
      imports: [TextareaModule],
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
  },
};
