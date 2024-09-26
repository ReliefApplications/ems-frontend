import {
  FormInputStory,
  sharedForm,
  sharedQuestion,
  FormInputStoryMeta,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Boolean',
};

/**
 * Default inputs Boolean
 */
export const Default: FormInputStory = {
  args: {
    title: 'Boolean question',
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
    };
  },
};

/**
 * ReadOnly inputs Boolean
 */
export const ReadOnly: FormInputStory = {
  args: {
    title: 'Boolean question',
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
                    type: 'boolean',
                    name: 'question1',
                    ...sharedQuestion(args),
                    defaultValue: 'true',
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
