import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SliderComponent } from './slider.component';

export default {
  title: 'SliderComponent',
  component: SliderComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<SliderComponent>;

const Template: Story<SliderComponent> = (args: SliderComponent) => ({
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
    minValue:  0,
    maxValue:  100,
}