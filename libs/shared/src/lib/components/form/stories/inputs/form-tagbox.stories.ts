import {
  FormInputStory,
  sharedForm,
  sharedQuestion,
  FormInputStoryMeta,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Tagbox',
};

/**
 * Default inputs Tagbox
 */
export const Tagbox: FormInputStory = {
  args: {
    title: 'Tagbox question',
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
    };
  },
};
