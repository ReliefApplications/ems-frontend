import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { BreadcrumbDisplay } from './enums/breadcrumb-display.enum';
import { BreadcrumbSeparator } from './enums/breadcrumb-separator.enum';

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
  separator: BreadcrumbSeparator.CHEVRON,
  display: BreadcrumbDisplay.SIMPLE,
};
