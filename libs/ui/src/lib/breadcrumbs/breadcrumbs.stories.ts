import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { breadCrumbDisplays } from './types/breadcrumb-display';
import { breadcrumbSeparators } from './types/breadcrumb-separator';
import { BreadcrumbsModule } from './breadcrumbs.module';
import { RouterTestingModule } from '@angular/router/testing';
import { StorybookTranslateModule } from '../../storybook-translate.module';

export default {
  title: 'Components/Breadcrumbs',
  tags: ['autodocs'],
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
      imports: [
        RouterTestingModule,
        BreadcrumbsModule,
        StorybookTranslateModule,
      ],
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
