import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { BreadcrumbDisplay } from './enums/breadcrumb-display.enum';
import { BreadcrumbSeparator } from './enums/breadcrumb-separator.enum';
import { BreadcrumbsModule } from './breadcrumbs.module';

export default {
  title: 'Breadcrumbs',
  component: BreadcrumbsComponent,
  argTypes: {
    separator: {
      options: BreadcrumbSeparator,
      control: 'select',
    },
    display: {
      options: BreadcrumbDisplay,
      control: 'select',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [BreadcrumbsModule],
    }),
  ],
} as Meta<BreadcrumbsComponent>;

/** Simple Chevron story */
export const SimpleChevron: StoryObj<BreadcrumbsComponent> = {
  args: {
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
  },
};

/** Simple slash story */
export const SimpleSlash: StoryObj<BreadcrumbsComponent> = {
  args: {
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
  },
};

/** Container story */
export const Contained: StoryObj<BreadcrumbsComponent> = {
  args: {
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
  },
};

/** Full width story */
export const Full: StoryObj<BreadcrumbsComponent> = {
  args: {
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
  },
};
