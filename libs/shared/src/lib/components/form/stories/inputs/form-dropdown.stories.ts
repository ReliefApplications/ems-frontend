import {
  FormInputStory,
  sharedForm,
  sharedQuestion,
  FormInputStoryMeta,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Dropdown',
};

/**
 * Default inputs Dropdown
 */
export const Dropdown: FormInputStory = {
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
