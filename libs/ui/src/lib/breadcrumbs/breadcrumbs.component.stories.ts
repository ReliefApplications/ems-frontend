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
        showLabel: true,
      },
      {
        text: 'item 1',
        uri: '#',
        showLabel: true,
      },
      {
        text: 'item 2',
        uri: '#',
        showLabel: true,
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
        showLabel: true,
      },
      {
        text: 'item 1',
        uri: '#',
        showLabel: true,
      },
      {
        text: 'item 2',
        uri: '#',
        showLabel: true,
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
        showLabel: true,
      },
      {
        text: 'item 1',
        uri: '#',
        showLabel: true,
      },
      {
        text: 'item 2',
        uri: '#',
        showLabel: true,
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
        showLabel: true,
      },
      {
        text: 'item 1',
        uri: '#',
        showLabel: true,
      },
      {
        text: 'item 2',
        uri: '#',
        showLabel: true,
      },
    ],
    separator: 'chevron',
    display: 'full',
  },
};
