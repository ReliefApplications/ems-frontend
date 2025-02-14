import {
  FormInputStoryMeta,
  DefaultFormInputStory,
  ReadOnlyFormInputStory,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Time',
};

/** Question name */
const questionName = 'Time question';

/** Base question */
const baseQuestion = {
  type: 'text',
  inputType: 'time',
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
  defaultValue: '1970-01-01T15:06:00.000Z',
});
