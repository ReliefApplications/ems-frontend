import { RouterTestingModule } from '@angular/router/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafePreviousButtonComponent } from './previous-button.component';
import { SafePreviousButtonModule } from './previous-button.module';

export default {
  component: SafePreviousButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule.withRoutes([]), SafePreviousButtonModule],
      providers: [],
    }),
  ],
  title: 'SAFE/Previous button',
} as Meta;
/**
 * Defines a template for the component SafePreviousButtonComponent to use as a playground
 *
 * @param args the properties of the instance of SafePreviousButtonComponent
 * @returns the template
 */
const TEMPLATE: Story<SafePreviousButtonComponent> = (args) => ({
  props: {
    ...args,
  },
});

/** Exports a default template */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.args = {};
