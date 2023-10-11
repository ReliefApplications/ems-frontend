import {
  Meta,
  StoryObj,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';
import { FormComponent } from './form.component';
import { FormModule } from './form.module';
import { DialogModule } from '@angular/cdk/dialog';
import { ApolloModule } from 'apollo-angular';
import { StorybookTranslateModule } from '../storybook-translate/storybook-translate-module';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../services/auth/auth.service';
import { BehaviorSubject } from 'rxjs';

// You can create new stories getting the logic from: https://surveyjs.io/create-free-survey

class MockAuthService {
  userValue = {
    name: 'Mocked',
  };

  user = new BehaviorSubject({
    name: 'Dummy',
    firstName: 'Dummy',
    lastName: 'Dummy',
    email: 'dummy@mail.com',
    roles: [],
    id: 'dummyid',
  });
}

export default {
  title: 'Form/Examples',
  tags: ['autodocs'],
  component: FormComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(DialogModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookTranslateModule),
        importProvidersFrom(ApolloModule),
        {
          provide: 'environment',
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: new MockAuthService(),
        },
      ],
    }),
    moduleMetadata({
      imports: [FormModule],
    }),
  ],
} as Meta<FormComponent>;

type Story = StoryObj<FormComponent>;

const sharedForm = {
  id: 'dummy',
  canCreateRecords: true,
};

export const Radio: Story = {
  name: 'Radio',
  render: () => ({
    props: {
      form: {
        ...sharedForm,
        structure: JSON.stringify({
          pages: [
            {
              name: 'page1',
              elements: [
                {
                  type: 'radiogroup',
                  name: 'question1',
                  title: 'Radio question',
                  choices: ['Item 1', 'Item 2', 'Item 3'],
                },
              ],
            },
          ],
          showQuestionNumbers: 'off',
        }),
      },
    },
  }),
};

export const YesNo: Story = {
  render: () => ({
    props: {
      form: {
        ...sharedForm,
        structure: JSON.stringify({
          pages: [
            {
              name: 'page1',
              elements: [
                {
                  type: 'boolean',
                  name: 'question1',
                  title: 'Yes/No',
                },
              ],
            },
          ],
          showQuestionNumbers: 'off',
        }),
      },
    },
  }),
};

export const Checkbox: Story = {
  render: () => ({
    props: {
      form: {
        ...sharedForm,
        structure: JSON.stringify({
          pages: [
            {
              name: 'page1',
              elements: [
                {
                  type: 'checkbox',
                  name: 'question1',
                  title: 'Checkbox',
                  choices: ['Item 1', 'Item 2', 'Item 3'],
                  showOtherItem: true,
                  showNoneItem: true,
                  showSelectAllItem: true,
                },
              ],
            },
          ],
          showQuestionNumbers: 'off',
        }),
      },
    },
  }),
};

export const Date: Story = {
  render: () => ({
    props: {
      form: {
        ...sharedForm,
        structure: JSON.stringify({
          pages: [
            {
              name: 'page1',
              elements: [
                {
                  type: 'text',
                  name: 'question1',
                  title: 'Date',
                  inputType: 'date',
                },
              ],
            },
          ],
          showQuestionNumbers: 'off',
        }),
      },
    },
  }),
};
