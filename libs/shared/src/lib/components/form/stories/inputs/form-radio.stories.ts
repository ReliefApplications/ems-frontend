import {
  FormInputStoryMeta,
  DefaultFormInputStory,
  ReadOnlyFormInputStory,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Radio',
};

/** Question name */
const questionName = 'Radio question';

/** Base question */
const baseQuestion = {
  type: 'radiogroup',
  choices: ['Item 1', 'Item 2', 'Item 3'],
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
  defaultValue: 'Item 1',
});
