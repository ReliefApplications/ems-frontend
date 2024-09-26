import {
  FormInputStory,
  sharedForm,
  sharedQuestion,
  FormInputStoryMeta,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Week',
};

/**
 * Default inputs Week
 */
export const Week: FormInputStory = {
  args: {
    title: 'Week question',
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
    };
  },
};
