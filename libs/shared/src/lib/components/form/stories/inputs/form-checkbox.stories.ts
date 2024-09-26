import {
  FormInputStory,
  sharedForm,
  sharedQuestion,
  FormInputStoryMeta,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Checkbox',
};

/**
 * Default inputs Checkbox
 */
export const Default: FormInputStory = {
  args: {
    title: 'Checkbox question',
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
    };
  },
};

/**
 * ReadOnly inputs Checkbox
 */
export const ReadOnly: FormInputStory = {
  args: {
    title: 'Checkbox question',
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
                    type: 'checkbox',
                    name: 'question1',
                    choices: ['Item 1', 'Item 2', 'Item 3'],
                    showOtherItem: true,
                    showNoneItem: true,
                    showSelectAllItem: true,
                    ...sharedQuestion(args),
                    defaultValue: ['Item 1'],
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
