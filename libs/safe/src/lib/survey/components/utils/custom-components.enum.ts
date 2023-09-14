import { Type } from '@angular/core';
import { QuestionResourceDropdownModel } from '../../../components/resource-dropdown/resource-dropdown.model';
import { SafeResourceDropdownComponent } from '../../../components/resource-dropdown/resource-dropdown.component';
import { SafeResourceAvailableFieldsComponent } from '../../../components/resource-available-fields/resource-available-fields.component';
import { QuestionResourceAvailableFieldsModel } from '../../../components/resource-available-fields/resource-available-fields.model';
import { SafeTestServiceDropdownComponent } from '../../../components/test-service-dropdown/test-service-dropdown.component';
import { QuestionTestServiceDropdownModel } from '../../../components/test-service-dropdown/resource-dropdown.model';
import { SafeResourceSelectTextComponent } from '../../../components/resource-select-text/resource-select-text.component';
import { QuestionResourceSelectTextModel } from '../../../components/resource-select-text/resource-select-text.model';
import { SafeResourceCustomFiltersComponent } from '../../../components/resource-custom-filters/resource-custom-filters.component';
import { QuestionResourceCustomFiltersModel } from '../../../components/resource-custom-filters/resource-select-text.model';

/**
 * Custom component types for the survey creator property grid editor
 */
export enum CustomPropertyGridComponentTypes {
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
