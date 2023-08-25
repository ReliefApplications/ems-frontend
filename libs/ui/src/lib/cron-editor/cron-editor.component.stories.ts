import { moduleMetadata, StoryObj, Meta } from '@storybook/angular';
import { CronEditorModule } from './cron-editor.module';
import { CronEditorComponent } from './cron-editor.component';

export default {
  title: 'CronEditorComponent',
  component: CronEditorComponent,
  decorators: [
    moduleMetadata({
      imports: [CronEditorModule],
    })
  ],
} as Meta<CronEditorComponent>;

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
      // Time options
      use24HourTime: true,
      hideSeconds: false,
      removeSeconds: false,
      removeYears: false
    }
  }
}