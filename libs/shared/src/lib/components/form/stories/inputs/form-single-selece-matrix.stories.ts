import {
  FormInputStoryMeta,
  DefaultFormInputStory,
  ReadOnlyFormInputStory,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Single Select Matrix',
};

/** Question name */
const questionName = 'Single Select Matrix question';

/** Base question */
const baseQuestion = {
  type: 'matrix',
  columns: ['Column 1', 'Column 2', 'Column 3'],
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
    'Row 1': 'Column 1',
    'Row 2': 'Column 2',
  },
});
