import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ReferenceDatasComponent } from './reference-datas.component';

export default {
  title: 'ReferenceDatasComponent',
  component: ReferenceDatasComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ReferenceDatasComponent>;

const Template: Story<ReferenceDatasComponent> = (
  args: ReferenceDatasComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
