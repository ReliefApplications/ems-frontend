import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ContextDatasourceComponent } from './context-datasource.component';

export default {
  title: 'ContextDatasourceComponent',
  component: ContextDatasourceComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ContextDatasourceComponent>;

const Template: Story<ContextDatasourceComponent> = (
  args: ContextDatasourceComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
