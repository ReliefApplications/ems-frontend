import {
  moduleMetadata,
  Meta,
  StoryObj,
  componentWrapperDecorator,
} from '@storybook/angular';
import { DividerComponent } from './divider.component';
import { DividerModule } from './divider.module';
import { DividerPosition } from './enums/divider-position.enum';
import { DividerOrientation } from './enums/divider-orientation.enum';

export default {
  title: 'Divider',
  component: DividerComponent,
  argTypes: {
    position: {
      options: DividerPosition,
      control: {
        type: 'select',
      },
    },
    orientation: {
      options: DividerOrientation,
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
    position: DividerPosition.CENTER,
    text: 'Test',
    orientation: DividerOrientation.HORIZONTAL,
  },
};

/** Vertical divider */
export const Vertical: StoryObj<DividerComponent> = {
  args: {
    position: DividerPosition.CENTER,
    orientation: DividerOrientation.VERTICAL,
  },
};
