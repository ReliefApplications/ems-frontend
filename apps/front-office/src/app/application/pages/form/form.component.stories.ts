import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { FormComponent } from './form.component';
import { Apollo } from 'apollo-angular';
import { Dialog } from '@angular/cdk/dialog';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { InjectionToken } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const dialogScrollStrategyMock = new InjectionToken<any>(
  'DialogScrollStrategy'
);

export default {
  title: 'FormComponent',
  component: FormComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [
        Apollo,
        Dialog,
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
} as Meta<FormComponent>;

const Template: Story<FormComponent> = (args: FormComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
