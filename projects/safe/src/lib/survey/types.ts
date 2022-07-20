import * as Survey from 'survey-angular';

/** Custom properties definition */
export interface GlobalProperties {
  tooltip?: string;
}

// REWRITING OF EXISTING QUESTION TYPES

/** Main Question type */
export interface Question extends Survey.Question, GlobalProperties {}

/** Text question with extended properties */
export interface QuestionText extends Survey.QuestionText, GlobalProperties {
  dateMin?: Date;
  dateMax?: Date;
}

/** Interface for question of type comment */
export interface QuestionComment
  extends Survey.QuestionComment,
    GlobalProperties {
  allowEdition?: boolean;
}

/** Custom type of questions for reference data */
export interface QuestionSelectBase
  extends Survey.QuestionSelectBase,
    GlobalProperties {
  referenceData?: string;
  referenceDataDisplayField?: string;
  referenceDataFilterFilterFromQuestion?: string;
  referenceDataFilterForeignField?: string;
  referenceDataFilterFilterCondition?: string;
  referenceDataFilterLocalField?: string;
  referenceDataChoicesLoaded?: boolean;
}

// TYPES FOR CUSTOM QUESTIONS

/** Model for owner question */
export interface QuestionOwner extends Survey.QuestionCustom, GlobalProperties {
  applications?: any;
  contentQuestion: QuestionSelectBase;
}

/** Model for resource question */
export interface QuestionResource
  extends Survey.QuestionCustom,
    GlobalProperties {
  resource?: string;
  displayField: null | string;
  relatedName?: string;
  addRecord?: boolean;
  canSearch?: boolean;
  addTemplate?: any;
  placeholder?: string;
  prefillWithCurrentRecord?: boolean;
  selectQuestion?: any;
  contentQuestion: Survey.QuestionDropdown;
  gridFieldsSettings?: any;
  filterCondition: string;
  filterBy: string;
  staticValue: string;
  customFilter: string;
}

export type AnyQuestion = Survey.SurveyElement &
  Partial<
    Question &
      QuestionText &
      QuestionComment &
      QuestionSelectBase &
      QuestionOwner &
      QuestionResource &
      Survey.QuestionMultipleText &
      Survey.QuestionMatrix &
      Survey.QuestionMatrixDropdown &
      Survey.QuestionPanelDynamic
  >;
