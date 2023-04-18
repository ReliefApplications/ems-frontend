import { moduleMetadata, Story, Meta } from '@storybook/angular';
import {
  BreadcrumbDisplay,
  BreadcrumbSeperator,
  BreadcrumbsComponent,
} from './breadcrumbs.component';

export default {
  title: 'BreadcrumbsComponent',
  component: BreadcrumbsComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<BreadcrumbsComponent>;

const Template: Story<BreadcrumbsComponent> = (args: BreadcrumbsComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  breadcrumbs: [
    {
      text: 'item 0',
      uri: '#',
    },
    {
      text: 'item 1',
      uri: '#',
    },
    {
      text: 'item 2',
      uri: '#',
    },
  ],
  seperator: BreadcrumbSeperator.CHEVRON,
  display: BreadcrumbDisplay.SIMPLE,
};
