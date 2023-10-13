import {
  Meta,
  moduleMetadata,
  StoryObj,
  applicationConfig,
} from '@storybook/angular';
import { ApplicationsSummaryComponent } from './applications-summary.component';
import { ApplicationsSummaryModule } from './applications-summary.module';
import { StorybookTranslateModule } from '../storybook-translate/storybook-translate-module';
import { status } from '../../models/form.model';
import { importProvidersFrom } from '@angular/core';

export default {
  title: 'UI/Applications/Applications Summary',
  argTypes: {},
  component: ApplicationsSummaryComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(StorybookTranslateModule)],
    }),
    moduleMetadata({
      imports: [ApplicationsSummaryModule, StorybookTranslateModule],
    }),
  ],
} as Meta<ApplicationsSummaryComponent>;

type Story = StoryObj<ApplicationsSummaryComponent>;

/** Default inputs */
export const Default: Story = {
  render: () => ({
    props: {
      canCreate: true,
      loading: false,
      applications: [
        {
          name: 'Dummy Application',
          createdAt: new Date(),
          status: status.active,
        },
        {
          name: 'Dummy Application',
          createdAt: new Date(),
          status: status.pending,
        },
        {
          name: 'Dummy Application',
          createdAt: new Date(),
          status: status.archived,
        },
        {
          name: 'Dummy Application',
          createdAt: new Date(),
          status: status.active,
        },
        {
          name: 'Dummy Application',
          createdAt: new Date(),
        },
      ],
    },
  }),
};

/**
 * Loading state
 */
export const Loading: Story = {
  render: () => ({
    props: {
      loading: true,
    },
  }),
};
