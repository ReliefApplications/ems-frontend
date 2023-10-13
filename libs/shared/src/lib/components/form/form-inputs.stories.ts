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
                  title: 'Color',
                  inputType: 'color',
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
export const DateTime: Story = {
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
                  title: 'Date and Time',
                  inputType: 'datetime-local',
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
                  title: 'Month',
                  inputType: 'month',
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
                  title: 'Number',
                  inputType: 'number',
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
                  title: 'Password',
                  inputType: 'password',
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
                  title: 'Range',
                  inputType: 'range',
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
                  title: 'Telephone',
                  inputType: 'tel',
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
                  title: 'Text',
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
                  title: 'Time',
                  inputType: 'time',
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
                  title: 'URL',
                  inputType: 'url',
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
                  title: 'Week',
                  inputType: 'week',
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
                  type: 'matrix',
                  name: 'Single-Select Matrix',
                  columns: ['Column 1', 'Column 2', 'Column 3'],
                  rows: ['Row 1', 'Row 2'],
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
                  type: 'matrixdropdown',
                  name: 'question1',
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
 * Default inputs DinamicMatrix
 */
export const DinamicMatrix: Story = {
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
                  type: 'matrixdynamic',
                  name: 'question1',
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
                  type: 'rating',
                  title: 'Rating Scale',
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
                  title: 'CheckBox',
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
                  type: 'tagbox',
                  title: 'Multi-Select Dropdown',
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
