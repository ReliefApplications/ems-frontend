import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { UploadMenuComponent } from './upload-menu.component';
import { UploadMenuModule } from './upload-menu.module';
import { StorybookTranslateModule } from '../../../../.storybook/storybook-translate.module';

type Story = UploadMenuComponent;

export default {
  title: 'Components/Upload Menu',
  tags: ['autodocs'],
  component: UploadMenuComponent,
  decorators: [
    moduleMetadata({
      imports: [UploadMenuModule, StorybookTranslateModule],
    }),
  ],
} as Meta<Story>;

/**
 * Default story
 *
 * @returns StoryFn
 */
export const Default: StoryFn<Story> = () => {
  return {
    props: {},
  };
};
