import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { breadCrumbDisplays } from './types/breadcrumb-display';
import { breadcrumbSeparators } from './types/breadcrumb-separator';
import { BreadcrumbsModule } from './breadcrumbs.module';

export default {
  title: 'Breadcrumbs',
  component: BreadcrumbsComponent,
  argTypes: {
    separator: {
      options: breadcrumbSeparators,
      control: 'select',
    },
    display: {
      options: breadCrumbDisplays,
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
    separator: 'chevron',
    display: 'simple',
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
    separator: 'slash',
    display: 'simple',
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
    separator: 'chevron',
    display: 'contained',
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
    separator: 'chevron',
    display: 'full',
  },
};
