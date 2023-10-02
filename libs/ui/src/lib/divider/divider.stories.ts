import {
  moduleMetadata,
  Meta,
  StoryObj,
  componentWrapperDecorator,
} from '@storybook/angular';
import { DividerComponent } from './divider.component';
import { DividerModule } from './divider.module';
import { dividerPositions } from './types/divider-position';
import { dividerOrientations } from './types/divider-orientation';

export default {
  title: 'Components/Divider',
  tags: ['autodocs'],
  component: DividerComponent,
  argTypes: {
    position: {
      options: dividerPositions,
      control: {
        type: 'select',
      },
    },
    orientation: {
      options: dividerOrientations,
      control: {
        type: 'select',
      },
    },
    text: {
      control: {
        type: 'text',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [DividerModule],
    }),
    componentWrapperDecorator(
      (story) => `<div class="h-screen">${story}</div>`
    ),
  ],
} as Meta<DividerComponent>;

/** Horizontal divider */
export const Horizontal: StoryObj<DividerComponent> = {
  args: {
    position: 'center',
    text: 'Test',
    orientation: 'horizontal',
  },
};

/** Vertical divider */
export const Vertical: StoryObj<DividerComponent> = {
  args: {
    position: 'center',
    orientation: 'vertical',
  },
};
