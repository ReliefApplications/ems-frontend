import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ToolbarComponent } from './toolbar.component';
import { Variant } from '../shared/variant.enum';
import { ToolbarModule } from './toolbar.module';

export default {
  title: 'Toolbar',
  component: ToolbarComponent,
  argTypes: {
    variant: {
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

/**
 * Template for storybook's test of the component
 *
 * @param args
 * Arguments of the story
 * @returns ToolbarComponent
 */
const Template: Story<ToolbarComponent> = (args: ToolbarComponent) => ({
  props: args,
  template: `
  <ui-toolbar [variant]="variant" [color]="color">
  <ng-container ngProjectAs="leftContent">
  <svg class="mr-1.5 h-5 w-5 flex-shrink-0 lg:hidden" viewBox="0 0 100 80" width="40" height="40" fill="currentColor" aria-hidden="true">
  <rect width="100" height="20"></rect>
  <rect y="30" width="100" height="20"></rect>
  <rect y="60" width="100" height="20"></rect>
</svg>
  </ng-container>
  <div ngProjectAs="headTitle">Back-office</div>
  <div ngProjectAs="userName">Jean-Eudes</div>
  <div ngProjectAs="userMail">je@reliefapps.org</div>
  <ng-container ngProjectAs="rightContent">
  <svg class="mr-1.5 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" />
  </svg>
  <svg class="mr-1.5 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clip-rule="evenodd" />
  </svg>
  </ng-container>
  </ui-toolbar>`,
});

/**
 * Purple background light text version
 *
 */
export const Purple_Light = Template.bind({});
Purple_Light.args = {
  color: '#6f51ae',
  variant: Variant.LIGHT,
};
/**
 * Purple background dark text version
 *
 */
export const Purple_Dark = Template.bind({});
Purple_Dark.args = {
  color: '#6f51ae',
  variant: Variant.DARK,
};
/**
 * Green background dark text version
 *
 */
export const Green_Dark = Template.bind({});
Green_Dark.args = {
  color: '#ceded8',
  variant: Variant.DARK,
};
