import { Apollo } from 'apollo-angular';
import * as Survey from 'survey-angular';
import { Record } from '../models/record.model';
import { SafeAuthService } from '../services/auth/auth.service';
import { Form } from '../models/form.model';

/** Custom global properties definition */
export interface GlobalProperties {
  tooltip?: string;
}

// REWRITING OF EXISTING QUESTION TYPES

/** Type for general question */
export interface Question extends Survey.Question, GlobalProperties {}

/** Type for text question */
export interface QuestionText
  extends Survey.QuestionTextModel,
    GlobalProperties {
  dateMin?: Date;
  dateMax?: Date;
}

/** Type for comment question */
export interface QuestionComment
  extends Survey.QuestionCommentModel,
    GlobalProperties {
  allowEdition?: boolean;
}

/** Type for all select-based questions */
export interface QuestionSelectBase
  extends Survey.QuestionSelectBase,
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
export interface QuestionOwner
  extends Survey.QuestionCustomModel,
    GlobalProperties {
  applications?: any;
  contentQuestion: QuestionSelectBase;
}

/** Type for resource question */
export interface QuestionResource
  extends Survey.QuestionCustomModel,
    GlobalProperties {
  resource?: string;
  displayField: null | string;
  relatedName?: string;
  addRecord?: boolean;
  alwaysCreateRecord?: boolean;
  canSearch?: boolean;
  addTemplate?: any;
  placeholder?: string;
  prefillWithCurrentRecord?: boolean;
  selectQuestion?: any;
  contentQuestion: Survey.QuestionDropdownModel;
  gridFieldsSettings?: any;
  filterCondition: string;
  filterBy: string;
  staticValue: string;
  customFilter: string;
  displayAsGrid: boolean;
  remove?: boolean;
}

export type GlobalOptions = {
  apollo: Apollo;
  record: Record | undefined;
  form: Form | undefined;
  authService: SafeAuthService;
};
