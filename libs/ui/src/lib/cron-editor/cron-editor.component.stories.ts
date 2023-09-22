import { moduleMetadata, StoryObj, Meta } from '@storybook/angular';
import { CronEditorModule } from './cron-editor.module';
import { CronEditorComponent } from './cron-editor.component';
import { SelectMenuModule } from '../select-menu/select-menu.module';
import { FormWrapperModule } from '../form-wrapper/form-wrapper.module';
import { TabsModule } from '../tabs/tabs.module';
import { RadioModule } from '../radio/radio.module';
import { CheckboxModule } from '../checkbox/checkbox.module';

export default {
  title: 'CronEditorComponent',
  component: CronEditorComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CronEditorModule,
        SelectMenuModule,
        FormWrapperModule,
        TabsModule,
        RadioModule,
        CheckboxModule,
      ],
    }),
  ],
} as Meta<CronEditorComponent>;

/**
 * CronEditor story
 */
export const cronEditor: StoryObj<CronEditorComponent> = {
  args: {
    options: {
      defaultTime: '00:00:00',
      // Cron Tab Options
      hideMinutesTab: false,
      hideHourlyTab: false,
      hideDailyTab: false,
      hideWeeklyTab: false,
      hideMonthlyTab: false,
      hideYearlyTab: false,
      hideAdvancedTab: true,
      hideSpecificWeekDayTab: false,
      hideSpecificMonthWeekTab: false,
      // Time options
      use24HourTime: true,
      hideSeconds: false,
      // standard or quartz
      cronFlavor: 'standard',
    },
  },
};
