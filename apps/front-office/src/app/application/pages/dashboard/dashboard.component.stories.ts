import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DashboardComponent } from './dashboard.component';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { InjectionToken } from '@angular/core';

const dialogScrollStrategyMock = new InjectionToken<any>(
  'DialogScrollStrategy'
);

export default {
  title: 'DashboardComponent',
  component: DashboardComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [
        Apollo,
        Dialog,
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
} as Meta<DashboardComponent>;

const Template: Story<DashboardComponent> = (args: DashboardComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
