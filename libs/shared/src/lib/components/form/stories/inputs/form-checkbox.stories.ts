import {
  FormInputStoryMeta,
  DefaultFormInputStory,
  ReadOnlyFormInputStory,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Checkbox',
};

/** Question name */
const questionName = 'Checkbox question';

/** Base question */
const baseQuestion = {
  type: 'checkbox',
  name: 'question1',
  choices: ['Item 1', 'Item 2', 'Item 3'],
  showOtherItem: true,
  showNoneItem: true,
  showSelectAllItem: true,
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
  defaultValue: ['Item 1'],
});
