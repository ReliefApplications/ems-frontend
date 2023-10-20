import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { RoleSummaryComponent } from './role-summary.component';
import { InjectionToken } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

const dialogScrollStrategyMock = new InjectionToken<any>(
  'DialogScrollStrategy'
);

export default {
  title: 'RoleSummaryComponent',
  component: RoleSummaryComponent,
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
} as Meta<RoleSummaryComponent>;

const Template: Story<RoleSummaryComponent> = (args: RoleSummaryComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
