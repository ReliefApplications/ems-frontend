import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { DividerComponent } from './divider.component';
import { DividerModule } from './divider.module';
import { DividerPosition } from './enums/divider-position.enum';
import { DividerOrientation } from './enums/divider-orientation.enum';

export default {
  title: 'DividerComponent',
  component: DividerComponent,
  decorators: [
    moduleMetadata({
      imports: [DividerModule],
    }),
  ],
} as Meta<DividerComponent>;

/** Template divider */
const Template: StoryFn<DividerComponent> = (args: DividerComponent) => ({
  props: args,
});

/** Primary divider */
export const Primary = Template.bind({});
Primary.args = {
  position: DividerPosition.CENTER,
  text: 'Test',
  orientation: DividerOrientation.HORIZONTAL,
};
