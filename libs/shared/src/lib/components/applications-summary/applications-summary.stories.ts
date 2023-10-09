import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { ApplicationsSummaryComponent } from './applications-summary.component';
import { ApplicationsSummaryModule } from './applications-summary.module';
import { StorybookTranslateModule } from '../storybook-translate/storybook-translate-module';

type Story = ApplicationsSummaryComponent & { content?: string };
export default {
  title: 'UI/Applications/Applications Summary',
  argTypes: {},
  component: ApplicationsSummaryComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ApplicationsSummaryModule, StorybookTranslateModule],
    }),
  ],
  render: (args: {
    loading: any;
    canCreate: any;
    add: any;
    applications: any;
    openApplication: any;
    delete: any;
    preview: any;
    clone: any;
  }) => {
    return {
      template: `<shared-applications-summary
      [loading]=${args.loading}
      [canCreate]=${args.canCreate}
      (add)=${args.add}
      [applications]=${args.applications}
      (openApplication)=${args.openApplication}
      (delete)=${args.delete}
      (preview)=${args.preview}
      (clone)=${args.clone}
    >
    </shared-applications-summary>
    <p style="font-family: system-ui;">The Angular component shared-applications-summary is a vital element in this application's architecture. It plays a crucial role in presenting and interacting with summaries of various applications. This component is meticulously designed to offer an intuitive and efficient user experience.</p>
    `,
    };
  },
} as Meta<Story>;

/** Default inputs */
export const Defaut: StoryObj<Story> = {
  args: {},
};
