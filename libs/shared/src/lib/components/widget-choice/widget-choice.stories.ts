import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { WidgetChoiceComponent } from './widget-choice.component';
import { WidgetChoiceModule } from './widget-choice.module';
import { IWidgetType, WIDGET_TYPES } from '../../models/dashboard.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorybookTranslateModule } from '../storybook-translate/storybook-translate-module';

export default {
  component: WidgetChoiceComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        WidgetChoiceModule,
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
const TEMPLATE: StoryFn<WidgetChoiceComponent> = (args) => ({
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
