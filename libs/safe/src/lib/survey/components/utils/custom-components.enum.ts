import { Type } from '@angular/core';
import { QuestionResourceDropdownModel } from '../../../components/resource-dropdown/resource-dropdown.model';

/**
 * Custom component types for the survey creator property grid editor
 */
export enum CustomPropertyGridComponentTypes {
  resourceDropdown = 'resource-dropdown',
  //   resourceAvailableFields = 'resource-available-fields',
  //   selectResourceText = 'select-resource-text',
  //   customFilters = 'custom-filters',
}

/**
 * Custom property grid record with type and related class model
 */
export const CustomPropertyGridEditors: Record<
  CustomPropertyGridComponentTypes,
  Type<any>
> = {
  [CustomPropertyGridComponentTypes.resourceDropdown]:
    QuestionResourceDropdownModel,
  //   [CustomPropertyGridComponentTypes.resourceAvailableFields]:
  //     QuestionResourceDropdownModel,
  //   [CustomPropertyGridComponentTypes.selectResourceText]:
  //     QuestionResourceDropdownModel,
  //   [CustomPropertyGridComponentTypes.customFilters]:
  //     QuestionResourceDropdownModel,
};
