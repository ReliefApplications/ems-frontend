import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { WorkflowComponent } from './workflow.component';
import { Apollo } from 'apollo-angular';
import { InjectionToken } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

const dialogScrollStrategyMock = new InjectionToken<any>(
  'DialogScrollStrategy'
);

export default {
  title: 'WorkflowComponent',
  component: WorkflowComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [
        Apollo,
        TranslateService,
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
} as Meta<WorkflowComponent>;

const Template: Story<WorkflowComponent> = (args: WorkflowComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
