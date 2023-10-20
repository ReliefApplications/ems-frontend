import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UserSummaryComponent } from './user-summary.component';
import { InjectionToken } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

const dialogScrollStrategyMock = new InjectionToken<any>(
  'DialogScrollStrategy'
);

export default {
  title: 'UserSummaryComponent',
  component: UserSummaryComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [
        {
          provide: dialogScrollStrategyMock,
          useValue: {},
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
      ],
    }),
  ],
} as Meta<UserSummaryComponent>;

const Template: Story<UserSummaryComponent> = (args: UserSummaryComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
