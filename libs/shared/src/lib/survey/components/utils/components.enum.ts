import { Type } from '@angular/core';
import {
  QuestionResourceDropdownModel,
  ResourceDropdownComponent,
} from '../resource-dropdown/public-api';
import {
  ResourceAvailableFieldsComponent,
  QuestionResourceAvailableFieldsModel,
} from '../resource-available-fields/public-api';
import {
  TestServiceDropdownComponent,
  QuestionTestServiceDropdownModel,
} from '../test-service-dropdown/public-api';
import {
  ResourceSelectTextComponent,
  QuestionResourceSelectTextModel,
} from '../resource-select-text/public-api';
import {
  ResourceCustomFiltersComponent,
  QuestionResourceCustomFiltersModel,
} from '../resource-custom-filters/public-api';
import {
  GeofieldsListboxComponent,
  QuestionGeospatialListboxModel,
} from '../geofields-listbox/public-api';
import {
  ApplicationDropdownComponent,
  QuestionOwnerApplicationsDropdownModel,
} from '../application-dropdown/public-api';
import {
  ReferenceDataDropdownComponent,
  QuestionReferenceDataDropdownModel,
} from '../reference-data-dropdown/public-api';
import {
  QuestionDateTypeDisplayerModel,
  DateTypeDisplayerComponent,
} from '../date-type-displayer/public-api';
import { SurveyQueriesComponent } from '../survey-queries/survey-queries.component';
import { QuestionSurveyQueriesModel } from '../survey-queries/survey-queries.model';

/**
 * Custom component types for the survey creator property grid editor
 */
export enum CustomPropertyGridComponentTypes {
  applicationsDropdown = 'applicationsDropdown',
  dateTypeDisplayer = 'date',
  geospatialListbox = 'listBox',
  referenceDataDropdown = 'reference-data-dropdown',
  resourcesAvailableFields = 'resourcesFields',
  resourceCustomFilters = 'customFilter',
  resourcesDropdown = 'resourcesDropdown',
  resourceSelectText = 'selectResourceText',
  resourceTestService = 'resourceTestService',
  surveyQueries = 'surveyQueries',
}

/**
 * Custom property grid record with type and related class model
 */
export const CustomPropertyGridEditors: Record<
  CustomPropertyGridComponentTypes,
  { component: Type<any>; model: Type<any> }
> = {
  [CustomPropertyGridComponentTypes.applicationsDropdown]: {
    component: ApplicationDropdownComponent,
    model: QuestionOwnerApplicationsDropdownModel,
  },
  [CustomPropertyGridComponentTypes.dateTypeDisplayer]: {
    component: DateTypeDisplayerComponent,
    model: QuestionDateTypeDisplayerModel,
  },
  [CustomPropertyGridComponentTypes.geospatialListbox]: {
    component: GeofieldsListboxComponent,
    model: QuestionGeospatialListboxModel,
  },
  [CustomPropertyGridComponentTypes.referenceDataDropdown]: {
    component: ReferenceDataDropdownComponent,
    model: QuestionReferenceDataDropdownModel,
  },
  [CustomPropertyGridComponentTypes.resourcesDropdown]: {
    model: QuestionResourceDropdownModel,
    component: ResourceDropdownComponent,
  },
  [CustomPropertyGridComponentTypes.resourcesAvailableFields]: {
    component: ResourceAvailableFieldsComponent,
    model: QuestionResourceAvailableFieldsModel,
  },
  [CustomPropertyGridComponentTypes.resourceSelectText]: {
    component: ResourceSelectTextComponent,
    model: QuestionResourceSelectTextModel,
  },
  [CustomPropertyGridComponentTypes.resourceCustomFilters]: {
    component: ResourceCustomFiltersComponent,
    model: QuestionResourceCustomFiltersModel,
  },
  [CustomPropertyGridComponentTypes.resourceTestService]: {
    component: TestServiceDropdownComponent,
    model: QuestionTestServiceDropdownModel,
  },
  [CustomPropertyGridComponentTypes.surveyQueries]: {
    component: SurveyQueriesComponent,
    model: QuestionSurveyQueriesModel,
  },
};
