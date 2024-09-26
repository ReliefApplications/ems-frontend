import {
  FormInputStory,
  sharedForm,
  sharedQuestion,
  FormInputStoryMeta,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Dynamic Matrix',
};

/**
 * Default inputs Dynamic Matrix
 */
export const DynamicMatrix: FormInputStory = {
  args: {
    title: 'Dynamic Matrix',
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
                    type: 'matrixdynamic',
                    name: 'Dynamic-Select Matrix',
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
