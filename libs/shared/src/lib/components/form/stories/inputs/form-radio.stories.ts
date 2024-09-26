import {
  FormInputStory,
  sharedForm,
  sharedQuestion,
  FormInputStoryMeta,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Radio',
};

/**
 * Default inputs Radio
 */
export const Radio: FormInputStory = {
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
