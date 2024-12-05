import { QuestionType } from '../../../../services/form-helper/form-helper.service';
import {
  FormInputStoryMeta,
  DefaultFormInputStory,
  ReadOnlyFormInputStory,
} from './form-inputs.stories-shared';

export default {
  ...FormInputStoryMeta,
  title: 'Form/Inputs/Dropdown',
};

/** Question name */
const questionName = 'Dropdown question';

/** Base question */
const baseQuestion = {
  type: QuestionType.DROPDOWN,
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
