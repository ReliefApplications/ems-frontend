import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SliderComponent } from './slider.component';
import { FormsModule } from '@angular/forms';
import { SliderModule } from '@progress/kendo-angular-inputs';

export default {
  title: 'SliderComponent',
  component: SliderComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, SliderModule],
    }),
  ],
} as Meta<SliderComponent>;

// eslint-disable-next-line jsdoc/require-returns
/**
 * Template for storybook's test of the component
 *
 * @param args
 * Arguments of the story
 */
const Template: Story<SliderComponent> = (args: SliderComponent) => ({
  props: args,
  template:
    '<ui-slider [(ngModel)]="external" [minValue]="minValue" [maxValue]="maxValue" name="externalVal" #validations="ngModel"></ui-slider> <p>external: {{external}}</p>',
});

/**
 * One to fourteen slider version
 */
export const OneToFourteen = Template.bind({});
OneToFourteen.args = {
  minValue: 1,
  maxValue: 14,
};

/**
 * Zero to eighteen slider version
 */
export const ZeroToEighteen = Template.bind({});
ZeroToEighteen.args = {
  minValue: 0,
  maxValue: 18,
};

/**
 * Minus three to ten slider version
 */
export const MinusThreeToTen = Template.bind({});
MinusThreeToTen.args = {
  minValue: -3,
  maxValue: 10,
};
