import {
  FormInputStory,
  sharedForm,
  sharedQuestion,
  FormInputStoryMeta,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Multi Select Matrix',
};

/**
 * Default inputs Multi Select Matrix
 */
export const MultiSelectMatrix: FormInputStory = {
  args: {
    title: 'Multi Select Matrix question',
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
                    type: 'matrixdropdown',
                    name: 'Multi-Select Matrix',
                    columns: [
                      {
                        name: 'Column 1',
                      },
                      {
                        name: 'Column 2',
                      },
                      {
                        name: 'Column 3',
                      },
                    ],
                    choices: [1, 2, 3, 4, 5],
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
