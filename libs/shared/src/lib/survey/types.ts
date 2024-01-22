import {
  QuestionTextModel,
  Question as SurveyCoreQuestion,
  QuestionCommentModel,
  QuestionSelectBase as SurveyCoreQuestionSelectBase,
  QuestionCustomModel,
  QuestionDropdownModel,
} from 'survey-core';

/** Custom global properties definition */
export interface GlobalProperties {
  tooltip?: string;
}

// REWRITING OF EXISTING QUESTION TYPES

/** Type for general question */
export interface Question extends SurveyCoreQuestion, GlobalProperties {}

/** Type for text question */
export interface QuestionText extends QuestionTextModel, GlobalProperties {
  dateMin?: Date;
  dateMax?: Date;
}

/** Type for comment question */
export interface QuestionComment
  extends QuestionCommentModel,
    GlobalProperties {
  allowEdition?: boolean;
}

/** Type for all select-based questions */
export interface QuestionSelectBase
  extends SurveyCoreQuestionSelectBase,
    GlobalProperties {
  referenceData?: string;
  referenceDataDisplayField?: string;
  isPrimitiveValue?: boolean;
  referenceDataFilterFilterFromQuestion?: string;
  referenceDataFilterForeignField?: string;
  referenceDataFilterFilterCondition?: string;
  referenceDataFilterLocalField?: string;
  referenceDataChoicesLoaded?: boolean;
}

// TYPES FOR CUSTOM QUESTIONS

/** Type for owner question */
export interface QuestionOwner extends QuestionCustomModel, GlobalProperties {
  applications?: any;
  contentQuestion: SurveyCoreQuestionSelectBase;
}

/** Type for the users question */
export interface QuestionUsers extends QuestionCustomModel, GlobalProperties {
  applications?: any;
}

/** Type for resource question */
export interface QuestionResource
  extends QuestionCustomModel,
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
  contentQuestion: QuestionDropdownModel;
  gridFieldsSettings?: any;
  filterCondition: string;
  filterBy: string;
  staticValue: string;
  customFilter: string;
  displayAsGrid: boolean;
  remove?: boolean;
  template?: string;
  draftData?: any;
}
