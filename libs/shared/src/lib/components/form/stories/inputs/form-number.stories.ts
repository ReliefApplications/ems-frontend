import {
  FormInputStoryMeta,
  DefaultFormInputStory,
  ReadOnlyFormInputStory,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Number',
};

/** Question name */
const questionName = 'Number question';

/** Base question */
const baseQuestion = {
  type: 'text',
  inputType: 'number',
};

/**
 * Default story.
 */
export const Default = DefaultFormInputStory(questionName, baseQuestion);

/**
 * ReadOnly story.
 */
export const ReadOnly = ReadOnlyFormInputStory(questionName, {
  ...baseQuestion,
  defaultValue: 111,
});
