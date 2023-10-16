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
  title: 'Form/Inputs',
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
  title: args.title,
  titleLocation: args.titleLocation,
  tooltip: args.tooltip,
  description: args.description,
  descriptionLocation: args.descriptionLocation,
});

/**
 * Default inputs Radio
 */
export const Radio: Story = {
  args: {
    title: 'Radio question',
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
                    type: 'radiogroup',
                    name: 'question1',
                    ...sharedQuestion(args),
                    choices: ['Item 1', 'Item 2', 'Item 3'],
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
 * Default inputs Dropdown
 */
export const Dropdown: Story = {
  args: {
    title: 'Dropdown question',
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
                    type: 'dropdown',
                    name: 'question1',
                    ...sharedQuestion(args),
                    choices: ['Item 1', 'Item 2', 'Item 3'],
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
 * Default inputs YesNo
 */
export const YesNo: Story = {
  args: {
    title: 'Yes/No',
  },
  render: (args) => ({
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
                  ...sharedQuestion(args),
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

/**
 * Default inputs Checkbox
 */
export const Checkbox: Story = {
  args: {
    title: 'Checkbox',
  },
  render: (args) => ({
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
                  choices: ['Item 1', 'Item 2', 'Item 3'],
                  showOtherItem: true,
                  showNoneItem: true,
                  showSelectAllItem: true,
                  ...sharedQuestion(args),
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

/**
 * Default inputs Date
 */
export const Date: Story = {
  args: {
    title: 'Date',
  },
  render: (args) => ({
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
  }),
};

/**
 * Default inputs Color
 */
export const Color: Story = {
  args: {
    title: 'Color',
  },
  render: (args) => ({
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
                  inputType: 'color',
                  ...sharedQuestion(args),
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
/**
 * Default inputs Date time
 */
export const DateTime: Story = {
  args: {
    title: 'Date and Time',
  },
  render: (args) => ({
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
                  inputType: 'datetime-local',
                  ...sharedQuestion(args),
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
/**
 * Default inputs Month
 */
export const Month: Story = {
  args: {
    title: 'Month',
  },
  render: (args) => ({
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
                  inputType: 'month',
                  ...sharedQuestion(args),
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
/**
 * Default inputs Number
 */
export const Number: Story = {
  args: {
    title: 'Number',
  },
  render: (args) => ({
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
                  inputType: 'number',
                  ...sharedQuestion(args),
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
/**
 * Default inputs Password
 */
export const Password: Story = {
  args: {
    title: 'Password',
  },
  render: (args) => ({
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
                  inputType: 'password',
                  ...sharedQuestion(args),
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
/**
 * Default inputs Range
 */
export const Range: Story = {
  args: {
    title: 'Range',
  },
  render: (args) => ({
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
                  inputType: 'range',
                  ...sharedQuestion(args),
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
/**
 * Default inputs Telephone
 */
export const Telephone: Story = {
  args: {
    title: 'Telephone',
  },
  render: (args) => ({
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
                  inputType: 'tel',
                  ...sharedQuestion(args),
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
/**
 * Default inputs Text
 */
export const Text: Story = {
  args: {
    title: 'Text',
  },
  render: (args) => ({
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
                  ...sharedQuestion(args),
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
/**
 * Default inputs Time
 */
export const Time: Story = {
  args: {
    title: 'Time',
  },
  render: (args) => ({
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
                  inputType: 'time',
                  ...sharedQuestion(args),
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
/**
 * Default inputs URL
 */
export const URL: Story = {
  args: {
    title: 'URL',
  },
  render: (args) => ({
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
                  inputType: 'url',
                  ...sharedQuestion(args),
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
/**
 * Default inputs Week
 */
export const Week: Story = {
  args: {
    title: 'Week',
  },
  render: (args) => ({
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
                  inputType: 'week',
                  ...sharedQuestion(args),
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
/**
 * Default inputs SingleSelectMatrix
 */
export const SingleSelectMatrix: Story = {
  args: {},
  render: (args) => ({
    props: {
      form: {
        ...sharedForm,
        structure: JSON.stringify({
          pages: [
            {
              name: 'page1',
              elements: [
                {
                  type: 'matrix',
                  name: 'Single-Select Matrix',
                  columns: ['Column 1', 'Column 2', 'Column 3'],
                  rows: ['Row 1', 'Row 2'],
                  ...sharedQuestion(args),
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

/**
 * Default inputs MultiSelectMatrix
 */
export const MultiSelectMatrix: Story = {
  args: {},
  render: (args) => ({
    props: {
      form: {
        ...sharedForm,
        structure: JSON.stringify({
          pages: [
            {
              name: 'page1',
              elements: [
                {
                  type: 'matrixdropdown',
                  name: 'Multi-Select Matrix',
                  columns: [
                    {
                      name: 'Column 1',
                    },
                    {
                      name: 'Column 2',
                    },
                    {
                      name: 'Column 3',
                    },
                  ],
                  choices: [1, 2, 3, 4, 5],
                  rows: ['Row 1', 'Row 2'],
                  ...sharedQuestion(args),
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
/**
 * Default inputs DynamicMatrix
 */
export const DynamicMatrix: Story = {
  args: {},
  render: (args) => ({
    props: {
      form: {
        ...sharedForm,
        structure: JSON.stringify({
          pages: [
            {
              name: 'page1',
              elements: [
                {
                  type: 'matrixdynamic',
                  name: 'Dynamic-Select Matrix',
                  columns: [
                    {
                      name: 'Column 1',
                    },
                    {
                      name: 'Column 2',
                    },
                    {
                      name: 'Column 3',
                    },
                  ],
                  choices: [1, 2, 3, 4, 5],
                  ...sharedQuestion(args),
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
/**
 * Default inputs RatingScale
 */
export const RatingScale: Story = {
  args: {
    title: 'Rating Scale',
  },
  render: (args) => ({
    props: {
      form: {
        ...sharedForm,
        structure: JSON.stringify({
          pages: [
            {
              name: 'page1',
              elements: [
                {
                  type: 'rating',
                  ...sharedQuestion(args),
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
/**
 * Default inputs CheckBox
 */
export const CheckBox: Story = {
  args: {
    title: 'CheckBox',
  },
  render: (args) => ({
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
                  ...sharedQuestion(args),
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
/**
 * Default inputs MultiSelectDropdown
 */
export const MultiSelectDropdown: Story = {
  args: {
    title: 'Multi-Select Dropdown',
  },
  render: (args) => ({
    props: {
      form: {
        ...sharedForm,
        structure: JSON.stringify({
          pages: [
            {
              name: 'page1',
              elements: [
                {
                  type: 'tagbox',
                  ...sharedQuestion(args),
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
