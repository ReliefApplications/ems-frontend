import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ShareComponent } from './share.component';
import { InjectionToken } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { TranslateService } from '@ngx-translate/core';

const dialogScrollStrategyMock = new InjectionToken<any>(
  'DialogScrollStrategy'
);

export default {
  title: 'ShareComponent',
  component: ShareComponent,
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
} as Meta<ShareComponent>;

const Template: Story<ShareComponent> = (args: ShareComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
