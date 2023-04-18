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

export const SimpleChevron = Template.bind({});
SimpleChevron.args = {
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

export const SimpleSlash = Template.bind({});
SimpleSlash.args = {
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
  separator: BreadcrumbSeparator.SLASH,
  display: BreadcrumbDisplay.SIMPLE,
};

export const Contained = Template.bind({});
Contained.args = {
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
  display: BreadcrumbDisplay.CONTAINED,
};

export const Full = Template.bind({});
Full.args = {
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
  display: BreadcrumbDisplay.FULL,
};
