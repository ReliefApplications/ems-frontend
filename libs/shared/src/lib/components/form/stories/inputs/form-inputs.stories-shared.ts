import {
  Meta,
  StoryObj,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';
import { FormComponent } from '../../form.component';
import { FormModule } from '../../form.module';
import { DialogModule } from '@angular/cdk/dialog';
import { ApolloModule } from 'apollo-angular';
import { StorybookTranslateModule } from '../../../storybook-translate/storybook-translate-module';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../../../services/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { FormService } from '../../../../services/form/form.service';
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
  /**
   * Mocked user value
   */
  userValue = {
    name: 'Mocked',
  };

  /**
   * Mocked user observable
   */
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

/** Form input shared story meta */
export const FormInputStoryMeta = {
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

export type FormInputStory = StoryObj<ExtendedFormComponent>;

/**
 * Shared form data
 */
export const sharedForm = {
  id: 'dummy',
  canCreateRecords: true,
};

/**
 * Shared Questions
 *
 * @param args Extended form component
 * @returns Shared questions structure
 */
export const sharedQuestion = (args: ExtendedFormComponent) => ({
  title: args.title,
  titleLocation: args.titleLocation,
  tooltip: args.tooltip,
  description: args.description,
  descriptionLocation: args.descriptionLocation,
});

/**
 * Generate a default story.
 *
 * @param title Question name
 * @param question Question model
 * @returns Default story
 */
export const DefaultFormInputStory = (title: string, question: any) => {
  const story: FormInputStory = {
    args: {
      title,
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
                      ...question,
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
  return story;
};

/**
 * Generate a read only story.
 *
 * @param title Question name
 * @param question Question model
 * @returns Read only story
 */
export const ReadOnlyFormInputStory = (title: string, question: any) => {
  const story: FormInputStory = {
    args: {
      title,
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
                      ...question,
                      ...sharedQuestion(args),
                    },
                  ],
                },
              ],
              showQuestionNumbers: 'off',
              mode: 'display',
            }),
          },
        },
      };
    },
  };
  return story;
};
