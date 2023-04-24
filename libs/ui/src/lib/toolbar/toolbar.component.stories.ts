import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ToolbarComponent } from './toolbar.component';
import { Variant } from '../shared/variant.enum';
import { ToolbarModule } from './toolbar.module';

export default {
  title: 'Toolbar',
  component: ToolbarComponent,
  argTypes: {
    toolbarVariant: {
      options: Variant,
      control: 'select',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ToolbarModule],
    }),
  ],
} as Meta<ToolbarComponent>;

const Template: Story<ToolbarComponent> = (args: ToolbarComponent) => ({
  props: args,
  template: `
  <ui-toolbar [color]="color">
  <ng-container ngProjectAs="leftWingContent">
  <button
    class="bg-gray-200 text-gray-700 shadow-md hover:shadow-xl hover:bg-gray-300 p-2 rounded-md"
  >
    Test
  </button>
  </ng-container>
  <div ngProjectAs="headerText">Back-office</div>
  <div ngProjectAs="userName">Jean-Eudes</div>
  <div ngProjectAs="userMail">je@reliefapps.org</div>
  <ng-container ngProjectAs="rightWingContent">
  <button
    class="bg-gray-200 text-gray-700 shadow-md hover:shadow-xl hover:bg-gray-300 p-2 rounded-md"
  >
    Random content
  </button>
  <button
    class="bg-gray-200 text-gray-700 shadow-md hover:shadow-xl hover:bg-gray-300 p-2 rounded-md"
  >
    Random bis
  </button>
  </ng-container>
  </ui-toolbar>`,
});

export const Primary = Template.bind({});
Primary.args = {
  color: '#6f51ae',
  toolbarVariant: Variant.LIGHT,
};
export const Secondary = Template.bind({});
Secondary.args = {
  color: '#ceded8',
  toolbarVariant: Variant.DARK,
};
