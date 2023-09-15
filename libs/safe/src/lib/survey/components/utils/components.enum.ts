import { Type } from '@angular/core';
import {
  QuestionResourceDropdownModel,
  SafeResourceDropdownComponent,
} from '../resource-dropdown/public-api';
import {
  SafeResourceAvailableFieldsComponent,
  QuestionResourceAvailableFieldsModel,
} from '../resource-available-fields/public-api';
import {
  SafeTestServiceDropdownComponent,
  QuestionTestServiceDropdownModel,
} from '../test-service-dropdown/public-api';
import {
  SafeResourceSelectTextComponent,
  QuestionResourceSelectTextModel,
} from '../resource-select-text/public-api';
import {
  SafeResourceCustomFiltersComponent,
  QuestionResourceCustomFiltersModel,
} from '../resource-custom-filters/public-api';
import {
  GeofieldsListboxComponent,
  QuestionGeospatialListboxModel,
} from '../geofields-listbox/public-api';
import {
  SafeApplicationDropdownComponent,
  QuestionOwnerApplicationsDropdownModel,
} from '../application-dropdown/public-api';
import {
  SafeReferenceDataDropdownComponent,
  QuestionReferenceDataDropdownModel,
} from '../reference-data-dropdown/public-api';
import {
  QuestionDateTypeDisplayerModel,
  SafeDateTypeDisplayerComponent,
} from '../date-type-displayer/public-api';

/**
 * Custom component types for the survey creator property grid editor
 */
export enum CustomPropertyGridComponentTypes {
  applicationsDropdown = 'applications-dropdown',
  dateTypeDisplayer = 'date-type-displayer',
  geospatialListbox = 'geospatial-listbox',
  referenceDataDropdown = 'reference-data-dropdown',
  resourceAvailableFields = 'resource-available-fields',
  resourceCustomFilters = 'resource-custom-filters',
  resourceDropdown = 'resource-dropdown',
  resourceSelectText = 'resource-select-text',
  resourceTestService = 'resource-test-service',
}

/**
 * Custom property grid record with type and related class model
 */
export const CustomPropertyGridEditors: Record<
  CustomPropertyGridComponentTypes,
  { component: Type<any>; model: Type<any> }
> = {
  [CustomPropertyGridComponentTypes.applicationsDropdown]: {
    component: SafeApplicationDropdownComponent,
    model: QuestionOwnerApplicationsDropdownModel,
  },
  [CustomPropertyGridComponentTypes.dateTypeDisplayer]: {
    component: SafeDateTypeDisplayerComponent,
    model: QuestionDateTypeDisplayerModel,
  },
  [CustomPropertyGridComponentTypes.geospatialListbox]: {
    component: GeofieldsListboxComponent,
    model: QuestionGeospatialListboxModel,
  },
  [CustomPropertyGridComponentTypes.referenceDataDropdown]: {
    component: SafeReferenceDataDropdownComponent,
    model: QuestionReferenceDataDropdownModel,
  },
  [CustomPropertyGridComponentTypes.resourceDropdown]: {
    model: QuestionResourceDropdownModel,
    component: SafeResourceDropdownComponent,
  },
  [CustomPropertyGridComponentTypes.resourceAvailableFields]: {
    component: SafeResourceAvailableFieldsComponent,
    model: QuestionResourceAvailableFieldsModel,
  },
  [CustomPropertyGridComponentTypes.resourceSelectText]: {
    component: SafeResourceSelectTextComponent,
    model: QuestionResourceSelectTextModel,
  },
  [CustomPropertyGridComponentTypes.resourceCustomFilters]: {
    component: SafeResourceCustomFiltersComponent,
    model: QuestionResourceCustomFiltersModel,
  },
  [CustomPropertyGridComponentTypes.resourceTestService]: {
    component: SafeTestServiceDropdownComponent,
    model: QuestionTestServiceDropdownModel,
  },
};
