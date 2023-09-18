import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { SafeWidgetChoiceComponent } from './widget-choice.component';
import { SafeWidgetChoiceModule } from './widget-choice.module';
import { IWidgetType, WIDGET_TYPES } from '../../models/dashboard.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorybookTranslateModule } from '../storybook-translate/storybook-translate-module';

export default {
  component: SafeWidgetChoiceComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SafeWidgetChoiceModule,
        BrowserAnimationsModule,
        StorybookTranslateModule,
      ],
      providers: [],
    }),
  ],
  title: 'Dashboard/Widget Choice',
  argsTypes: {
    floating: {
      defaultValue: false,
      control: { type: 'boolean' },
    },
  },
} as Meta;

/**
 * Template for story component
 *
 * @param args Parameters
 * @returns A story component
 */
const TEMPLATE: StoryFn<SafeWidgetChoiceComponent> = (args) => ({
  props: {
    ...args,
  },
});

/**
 * Default story.
 */
export const DEFAULT = {
  render: TEMPLATE,
  name: 'Default',

  args: {
    floating: false,
    widgetTypes: WIDGET_TYPES as IWidgetType[],
  },
};

/**
 * Floating story.
 */
export const FLOATING = {
  render: TEMPLATE,
  name: 'Floating',

  args: {
    ...DEFAULT.args,
    floating: true,
  },
};
