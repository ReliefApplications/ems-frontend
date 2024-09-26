import {
  FormInputStoryMeta,
  DefaultFormInputStory,
  ReadOnlyFormInputStory,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/DateTime',
};

/** Question name */
const questionName = 'DateTime question';

/** Base question */
const baseQuestion = {
  type: 'text',
  inputType: 'datetime-local',
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
  defaultValue: '2024-09-26T12:56:52.516Z',
});
