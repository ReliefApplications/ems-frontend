import {
  FormInputStoryMeta,
  DefaultFormInputStory,
  ReadOnlyFormInputStory,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Date',
};

/** Question name */
const questionName = 'Date question';

/** Base question */
const baseQuestion = {
  type: 'text',
  inputType: 'date',
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
  defaultValue: '2024-09-25T22:00:00.000Z',
});
