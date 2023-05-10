import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
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
const TEMPLATE: StoryFn<SafeDividerComponent> = (args) => ({
  template:
    '<div><div class="h-4"></div><safe-divider [text]="text" [position]="position"></safe-divider><div class="h-4"></div></div>',
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
};

/**
 * With text story.
 */
export const WITH_TEXT = {
  render: TEMPLATE,
  name: 'With Text',

  args: {
    text: 'Inner',
  },
};
