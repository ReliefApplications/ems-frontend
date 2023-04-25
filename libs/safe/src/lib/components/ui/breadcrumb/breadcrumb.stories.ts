import { RouterTestingModule } from '@angular/router/testing';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { StorybookTranslateModule } from '../../storybook-translate/storybook-translate-module';
import { SafeBreadcrumbComponent } from './breadcrumb.component';
import { SafeBreadcrumbModule } from './breadcrumb.module';

export default {
  component: SafeBreadcrumbComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SafeBreadcrumbModule,
        StorybookTranslateModule,
        RouterTestingModule,
      ],
    }),
  ],
  title: 'UI/Breadcrumb',
} as Meta;

/**
 * Template used by storybook to display the component in stories.
 *
 * @param args story arguments
 * @returns story template
 */
const TEMPLATE: StoryFn<SafeBreadcrumbComponent> = (args) => ({
  props: {
    ...args,
  },
});

export const DEFAULT = {
  render: TEMPLATE,
  name: 'Default',

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
  },
};
