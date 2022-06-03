import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeWidgetChoiceComponent } from './widget-choice.component';
import { SafeWidgetChoiceModule } from './widget-choice.module';
import { IWidgetType, WIDGET_TYPES } from '../../models/dashboard.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: SafeWidgetChoiceComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeWidgetChoiceModule, BrowserAnimationsModule],
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

const TEMPLATE: Story<SafeWidgetChoiceComponent> = (args) => ({
  props: {
    ...args,
  },
});

export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  floating: false,
  widgetTypes: WIDGET_TYPES as IWidgetType[],
};

export const FLOATING = TEMPLATE.bind({});
DEFAULT.storyName = 'Floating';
FLOATING.args = {
  ...DEFAULT.args,
  floating: true,
};
