/* eslint-disable @typescript-eslint/no-unused-vars */
import { QuestionFileModel } from 'survey-core';
import { SurveyQuestionEditorDefinition } from 'survey-creator-core';
import { Question } from '../types';

/** Adds the referenceData property to the matrix columns */
export const init = (): void => {
  SurveyQuestionEditorDefinition.definition[
    'matrixdropdowncolumn'
  ].properties?.push('referenceData');
};

/**
 * Render the other global properties
 *
 * @param question The question object
 */
export const render = (question: Question): void => {
  // define the max size for files
  if (question.getType() === 'file') {
    (question as QuestionFileModel).maxSize = 7340032;
  }
};
