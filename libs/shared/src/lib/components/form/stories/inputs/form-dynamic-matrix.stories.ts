import {
  FormInputStoryMeta,
  DefaultFormInputStory,
  ReadOnlyFormInputStory,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Dynamic Matrix',
};

/** Question name */
const questionName = 'Dynamic Matrix question';

/** Base question */
const baseQuestion = {
  type: 'matrixdynamic',
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
};

/**
 * Default story.
 */
export const Text = DefaultFormInputStory(questionName, baseQuestion);

/**
 * ReadOnly story.
 */
export const ReadOnly = ReadOnlyFormInputStory(questionName, {
  ...baseQuestion,
  defaultValue: [
    {
      'Column 1': 1,
      'Column 3': 3,
    },
    {
      'Column 2': 2,
    },
  ],
});
