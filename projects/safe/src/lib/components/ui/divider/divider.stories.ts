import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { DividerOrientation } from './divider-orientation.enum';
import { DividerPosition } from './divider-position.enum';
import { SafeDividerComponent } from './divider.component';
import { SafeDividerModule } from './divider.module';

export default {
  component: SafeDividerComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeDividerModule],
      providers: [],
    }),
  ],
  title: 'UI/Divider',
  argTypes: {
    position: {
      options: [
        DividerPosition.CENTER,
        DividerPosition.LEFT,
        DividerPosition.RIGHT,
      ],
      control: { type: 'select' },
    },
    text: {
      control: { type: 'text' },
    },
    orientation: {
      options: [DividerOrientation.HORIZONTAL, DividerOrientation.VERTICAL],
      control: { type: 'select' },
    },
  },
} as Meta;

/**
 * Template for divider stories
 *
 * @param args template arguments
 * @returns template
 */
const TEMPLATE: Story<SafeDividerComponent> = (args) => ({
  template:
    '<div><div class="h-4"></div><safe-divider [text]="text" [position]="position"></safe-divider><div class="h-4"></div></div>',
  props: {
    ...args,
  },
});

/** Default template */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';

/** Template with text */
export const WITH_TEXT = TEMPLATE.bind({});
WITH_TEXT.storyName = 'With Text';
WITH_TEXT.args = {
  text: 'Inner',
};
