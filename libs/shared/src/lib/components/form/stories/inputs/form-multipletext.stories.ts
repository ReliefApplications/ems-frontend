import {
  FormInputStoryMeta,
  DefaultFormInputStory,
  ReadOnlyFormInputStory,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Multiple Text',
};

/** Question name */
const questionName = 'Multiple Text question';

/** Base question */
const baseQuestion = {
  type: 'multipletext',
  items: [
    {
      name: 'text1',
    },
    {
      name: 'text2',
    },
  ],
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
    text1: 'Text one',
    text2: 'Text two',
  },
});
