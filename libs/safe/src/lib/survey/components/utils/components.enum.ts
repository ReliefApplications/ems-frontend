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
  applicationsDropdown = 'applicationsDropdown',
  dateTypeDisplayer = 'date',
  geospatialListbox = 'listBox',
  referenceDataDropdown = 'reference-data-dropdown',
  resourcesAvailableFields = 'resourcesFields',
  resourceCustomFilters = 'customFilter',
  resourcesDropdown = 'resourcesDropdown',
  resourceSelectText = 'selectResourceText',
  resourceTestService = 'resourceTestService',
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
  [CustomPropertyGridComponentTypes.resourcesDropdown]: {
    model: QuestionResourceDropdownModel,
    component: SafeResourceDropdownComponent,
  },
  [CustomPropertyGridComponentTypes.resourcesAvailableFields]: {
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
