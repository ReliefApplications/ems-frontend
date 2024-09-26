import {
  FormInputStoryMeta,
  DefaultFormInputStory,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/HTML',
};

/** Question name */
const questionName = 'HTML question';

/** Base question */
const baseQuestion = {
  type: 'html',
  html: '<div><b>Text</b></div>',
};

/**
 * Default story.
 */
export const Text = DefaultFormInputStory(questionName, baseQuestion);
