import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SliderComponent } from './slider.component';

export default {
  title: 'Components/Slider',
  component: SliderComponent,
  argTypes: {
    minValue: {
      defaultValue: 1,
      type: 'number',
    },
    maxValue: {
      defaultValue: 14,
      type: 'number',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule],
    }),
  ],
} as Meta<SliderComponent>;

/**
 *  Slider default template
 */
const sliderTemplate = `<div [formGroup]="formGroup" class="py-5">
<ui-slider formControlName="slider" [minValue]="minValue" [maxValue]="maxValue"></ui-slider>
</div>
<br>
<p>value: {{formGroup.get('slider').value}}</p>
<p>touched: {{formGroup.get('slider').touched}}</p>
`;

/**
 * Form group to test slider control value accessor
 */
const formGroup = new FormGroup({
  slider: new FormControl(4),
});

/**
 * Template for storybook's test of the component
 *
 * @param args Arguments of the story
 * @returns SliderComponent
 */
const Template: Story<SliderComponent> = (args: SliderComponent) => {
  args.minValue = 1;
  args.maxValue = 14;
  return {
    component: SliderComponent,
    template: sliderTemplate,
    props: {
      ...args,
      formGroup,
    },
  };
};

/**
 * One to fourteen slider version
 */
export const Slider = Template.bind({});
