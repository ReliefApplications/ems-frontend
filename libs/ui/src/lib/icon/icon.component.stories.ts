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
    icon: {
      defaultValue: 'search_outline',
      control: { type: 'text' },
    },
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

const updateIconList = (searchValue: string) => {
  console.log(searchValue);
  iconList = MAT_ICON_LIST;
};

let iconList: string[] = [];

let searchTerm: string = '';

/**
 * Template for all icons
 *
 * @returns StoryType
 */
const AllIconsTemplate: StoryFn<any> = () => {
  return {
    template: `
      <div class="h-screen pb-20">
        <h1 class="text-lg mb-4">List of all icons</h1>
        <input type="text" placeholder="Search.." [(ngModel)]="searchTerm" (input)="updateIconList(searchTerm)">
        <div class="flex flex-wrap gap-4 overflow-auto max-h-full">
          <div class="border rounded-lg flex items-center" *ngFor="let icon of iconList">
              <ui-icon class="p-4 border-r" [icon]="icon"></ui-icon>
              <h2 class="w-full text-center px-4">{{icon}}</h2>
          </div>
        </div>
      </div>`,
    props: {
      iconList,
      searchTerm,
      updateIconList,
    },
    argTypes: {},
  };
};

/** All buttons */
export const All = AllIconsTemplate.bind({});
