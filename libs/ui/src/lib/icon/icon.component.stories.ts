import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { IconComponent } from './icon.component';
import { variants } from '../types/variant';
import { IconModule } from './icon.module';
import { MAT_ICON_LIST } from './icon.list';

export default {
  title: 'Icon',
  component: IconComponent,
  argTypes: {
    variant: {
      options: variants,
      control: {
        type: 'select',
      },
    },
    size: {
      defaultValue: 24,
      control: 'number',
    },
    /** Disabled as the list of icons story doesn't use it */
    // icon: {
    //   defaultValue: 'search_outline',
    //   control: { type: 'text' },
    // },
  },
  decorators: [
    moduleMetadata({
      imports: [IconModule],
    }),
  ],
} as Meta<IconComponent>;

/**
 * Icon component template
 *
 * @param args Arguments for Icon Component
 * @returns IconComponent
 */
const Template: StoryFn<IconComponent> = (args: IconComponent) => ({
  props: args,
});

/**
 * Primary icon component
 */
export const Default = Template.bind({});
Default.args = {
  icon: 'search_outline',
  variant: 'default',
  size: 24,
};

/**
 * Template for all icons
 *
 * @param args Arguments for Icon Component
 * @returns StoryType
 */
const AllIconsTemplate: StoryFn<any> = (args: any) => {
  return {
    template: `
      <div class="h-screen pb-20">
        <h1 class="text-lg mb-4">List of all icons</h1>
        <div class="flex flex-wrap gap-4 overflow-auto max-h-full">
          <div class="border rounded-lg flex items-center" *ngFor="let icon of MAT_ICON_LIST">
              <ui-icon
                class="p-4 border-r bg-gray-100 rounded-l-lg"
                [icon]="icon"
                variant="${args.variant}"
                [size]="${args.size}"
              ></ui-icon>
              <h2 class="w-full text-center px-4">{{icon}}</h2>
          </div>
        </div>
      </div>`,
    props: {
      MAT_ICON_LIST,
    },
  };
};

/** All icons */
export const IconList = AllIconsTemplate.bind({});
IconList.args = {
  size: 24,
  variant: 'default',
};
