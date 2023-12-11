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
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../services/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { FormService } from '../../services/form/form.service';
import { PopupService } from '@progress/kendo-angular-popup';
import { ResizeBatchService } from '@progress/kendo-angular-common';
import { IconsService } from '@progress/kendo-angular-icons';
import { ComponentCollection, CustomWidgetCollection } from 'survey-core';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

// You can create new stories getting the logic from: https://surveyjs.io/create-free-survey

/**
 * Mocked auth service
 */
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

/**
 * Initialize app
 *
 * @param formService Form Service
 * @returns Initialized app
 */
const initializeApp =
  (formService: FormService): any =>
  () => {
    CustomWidgetCollection.Instance.clear();
    ComponentCollection.Instance.clear();
    formService.initialize();
  };

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
        importProvidersFrom(DateInputsModule),
        {
          provide: 'environment',
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: new MockAuthService(),
        },
        {
          provide: APP_INITIALIZER,
          useFactory: initializeApp,
          multi: true,
          deps: [FormService],
        },
        PopupService,
        ResizeBatchService,
        IconsService,
      ],
    }),
    moduleMetadata({
      imports: [FormModule],
    }),
  ],
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
    },
    titleLocation: {
      options: ['top', 'bottom', 'left'],
      control: {
        type: 'select',
      },
    },
    description: {
      control: {
        type: 'text',
      },
    },
    descriptionLocation: {
      options: ['underTitle', 'underInput'],
      control: {
        type: 'select',
      },
    },
    tooltip: {
      control: {
        type: 'text',
      },
    },
  },
} as Meta<FormComponent>;

type ExtendedFormComponent = FormComponent & {
  title?: string;
  titleLocation?: string;
  description?: string;
  descriptionLocation?: string;
  tooltip?: string;
};

type Story = StoryObj<ExtendedFormComponent>;

/**
 * Shared form data
 */
const sharedForm = {
  id: 'dummy',
  canCreateRecords: true,
};

/**
 * Shared Questions
 *
 * @param args Extended form component
 * @returns Shared questions structure
 */
const sharedQuestion = (args: ExtendedFormComponent) => ({
  titleLocation: args.titleLocation,
  tooltip: args.tooltip,
  descriptionLocation: args.descriptionLocation,
});

/**
 * Default example MultiPages
 */
export const MultiPages: Story = {
  args: {},
  render: (args) => {
    return {
      props: {
        form: {
          ...sharedForm,
          structure: JSON.stringify({
            pages: [
              {
                name: 'page1',
                elements: [
                  {
                    title: 'Dropdown',
                    type: 'dropdown',
                    name: 'question1',
                    ...sharedQuestion(args),
                    choices: ['Item 1', 'Item 2', 'Item 3'],
                  },
                  {
                    title: 'Radiogroup',
                    type: 'radiogroup',
                    name: 'question2',
                    ...sharedQuestion(args),
                    choices: ['Item a', 'Item b', 'Item c'],
                  },
                ],
              },
              {
                name: 'page2',
                elements: [
                  {
                    title: 'Yes/No',
                    type: 'boolean',
                    name: 'question1',
                    ...sharedQuestion(args),
                  },
                ],
              },
              {
                name: 'page3',
                elements: [
                  {
                    title: 'Date',
                    type: 'text',
                    name: 'question1',
                    inputType: 'date',
                    ...sharedQuestion(args),
                  },
                ],
              },
            ],
            showQuestionNumbers: 'off',
          }),
        },
      },
    };
  },
};

/**
 * Default example Logic
 */
export const Logic: Story = {
  args: {},
  render: (args) => {
    return {
      props: {
        form: {
          ...sharedForm,
          structure: JSON.stringify({
            pages: [
              {
                name: 'page1',
                elements: [
                  {
                    title: 'Dropdown',
                    type: 'dropdown',
                    name: 'question1',
                    description:
                      'Question 2 only will appears if the selected option is Item 1',
                    ...sharedQuestion(args),
                    choices: ['Item 1', 'Item 2', 'Item 3'],
                  },
                  {
                    title: 'Date',
                    type: 'text',
                    name: 'question2',
                    inputType: 'date',
                    visible: false,
                    visibleIf: "{question1} = 'Item 1'",
                    ...sharedQuestion(args),
                  },
                ],
              },
            ],
            showQuestionNumbers: 'off',
          }),
        },
      },
    };
  },
};

/**
 * Default example Default value
 */
export const DefaultValue: Story = {
  args: {
    title: 'Default value form',
  },
  render: (args) => {
    return {
      props: {
        form: {
          ...sharedForm,
          structure: JSON.stringify({
            pages: [
              {
                name: 'page1',
                elements: [
                  {
                    title: 'Number',
                    defaultValue: 10,
                    type: 'text',
                    name: 'question1',
                    inputType: 'number',
                    ...sharedQuestion(args),
                  },
                  {
                    title: 'Text',
                    defaultValue: 'Default value',
                    type: 'text',
                    name: 'question2',
                    inputType: 'text',
                    ...sharedQuestion(args),
                  },
                ],
              },
            ],
            showQuestionNumbers: 'off',
          }),
        },
      },
    };
  },
};
