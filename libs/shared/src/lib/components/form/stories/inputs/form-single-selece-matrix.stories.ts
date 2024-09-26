import {
  FormInputStory,
  sharedForm,
  sharedQuestion,
  FormInputStoryMeta,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Single Select Matrix',
};

/**
 * Default inputs Single Select Matrix
 */
export const SingleSelectMatrix: FormInputStory = {
  args: {
    title: 'Single Select Matrix question',
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
                    type: 'matrix',
                    name: 'Single-Select Matrix',
                    columns: ['Column 1', 'Column 2', 'Column 3'],
                    rows: ['Row 1', 'Row 2'],
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
