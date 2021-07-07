import { RouterTestingModule } from '@angular/router/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafePreviousButtonComponent } from './previous-button.component';
import { SafePreviousButtonModule } from './previous-button.module';

export default {
  component: SafePreviousButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [
        RouterTestingModule.withRoutes([]),
        SafePreviousButtonModule
      ],
      providers: []
    })
  ],
  title: 'SAFE/Previous button'
} as Meta;


const Template: Story<SafePreviousButtonComponent> = args => ({
  props: {
    ...args
  }
});

export const Default = Template.bind({});
Default.args = {};
