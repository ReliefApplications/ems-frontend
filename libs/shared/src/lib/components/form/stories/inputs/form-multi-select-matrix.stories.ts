import {
  FormInputStoryMeta,
  DefaultFormInputStory,
  ReadOnlyFormInputStory,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Multi Select Matrix',
};

/** Question name */
const questionName = 'Multi Select Matrix question';

/** Base question */
const baseQuestion = {
  type: 'matrixdropdown',
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
  defaultValue: {
    'Row 1': {
      'Column 1': 1,
      'Column 3': 3,
    },
    'Row 2': {
      'Column 2': 2,
    },
  },
});
