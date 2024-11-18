import {
  FormInputStoryMeta,
  DefaultFormInputStory,
  ReadOnlyFormInputStory,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Url',
};

/** Question name */
const questionName = 'Url question';

/** Base question */
const baseQuestion = {
  type: 'text',
  inputType: 'url',
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
  defaultValue: 'http://url.com',
});
