import {
  FormInputStory,
  sharedForm,
  sharedQuestion,
  FormInputStoryMeta,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Date',
};

/**
 * Default inputs Date
 */
export const Date: FormInputStory = {
  args: {
    title: 'Date question',
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
