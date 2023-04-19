import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { ToggleComponent } from './toggle.component';
import { ToggleModule } from './toggle.module';
import { ToggleType } from './enums/toggle-type.enum';

export default {
  title: 'ToggleComponent',
  component: ToggleComponent,
  decorators: [
    moduleMetadata({
      imports: [ToggleModule],
    }),
  ],
} as Meta<ToggleComponent>;

/**
 * Template toggle
 *
 * @param {ToggleComponent} args args
 */
const Template: StoryFn<ToggleComponent> = (args: ToggleComponent) => ({
  props: args,
});

/** Primary toggle */
export const Primary = Template.bind({});
Primary.args = {
  type: ToggleType.SIMPLE,
  icon: {
    disableIcon: 'close',
    enableIcon: 'save',
  },
  label: {
    text: 'Test test test!',
    position: 'left',
    description:
      'Test test test test test test test test test test test test test',
  },
};
