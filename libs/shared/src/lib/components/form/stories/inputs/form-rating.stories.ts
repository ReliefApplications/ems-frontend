import {
  FormInputStory,
  sharedForm,
  sharedQuestion,
  FormInputStoryMeta,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Rating',
};

/**
 * Default inputs Rating
 */
export const Rating: FormInputStory = {
  args: {
    title: 'Rating',
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
