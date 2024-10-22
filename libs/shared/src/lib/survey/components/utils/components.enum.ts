import { Type } from '@angular/core';
import {
  AcceptedValueTypesTextComponent,
  QuestionAcceptedValueTypesTextModel,
} from '../accepted-value-types-text/public-api';
import {
  ApplicationDropdownComponent,
  QuestionOwnerApplicationsDropdownModel,
} from '../application-dropdown/public-api';
import {
  CodeEditorComponent,
  CodeEditorModel,
} from '../code-editor/public-api';
import {
  CsDocsPropertiesDropdownComponent,
  QuestionCsDocsPropertiesDropdownModel,
} from '../cs-docs-properties-dropdown/public-api';
import {
  DateTypeDisplayerComponent,
  QuestionDateTypeDisplayerModel,
} from '../date-type-displayer/public-api';
import {
  GeofieldsListboxComponent,
  QuestionGeospatialListboxModel,
} from '../geofields-listbox/public-api';
import {
  JSONEditorComponent,
  JSONEditorModel,
} from '../json-editor/public-api';
import {
  QueryEditorComponent,
  QueryEditorModel,
} from '../query-editor/public-api';
import {
  QuestionReferenceDataDropdownModel,
  ReferenceDataDropdownComponent,
} from '../reference-data-dropdown/public-api';
import {
  QuestionResourceAvailableFieldsModel,
  ResourceAvailableFieldsComponent,
} from '../resource-available-fields/public-api';
import {
  QuestionResourceCustomFiltersModel,
  ResourceCustomFiltersComponent,
} from '../resource-custom-filters/public-api';
import {
  QuestionResourceDropdownModel,
  ResourceDropdownComponent,
} from '../resource-dropdown/public-api';
import {
  QuestionResourceSelectTextModel,
  ResourceSelectTextComponent,
} from '../resource-select-text/public-api';
import {
  QuestionTestServiceDropdownModel,
  TestServiceDropdownComponent,
} from '../test-service-dropdown/public-api';

/**
 * Custom component types for the survey creator property grid editor
 */
export enum CustomPropertyGridComponentTypes {
  applicationsDropdown = 'applicationsDropdown',
  csDocsPropertiesDropdown = 'csDocsPropertiesDropdown',
  dateTypeDisplayer = 'date',
  geospatialListbox = 'listBox',
  referenceDataDropdown = 'reference-data-dropdown',
  resourcesAvailableFields = 'resourcesFields',
  resourceCustomFilters = 'customFilter',
  resourcesDropdown = 'resourcesDropdown',
  resourceSelectText = 'selectResourceText',
  resourceTestService = 'resourceTestService',
  codeEditor = 'code-editor',
  queryEditor = 'query-editor',
  jsonEditor = 'json-editor',
  acceptedTypesValues = 'acceptedTypesValues',
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
  [CustomPropertyGridComponentTypes.codeEditor]: {
    component: CodeEditorComponent,
    model: CodeEditorModel,
  },
  [CustomPropertyGridComponentTypes.queryEditor]: {
    component: QueryEditorComponent,
    model: QueryEditorModel,
  },
  [CustomPropertyGridComponentTypes.jsonEditor]: {
    component: JSONEditorComponent,
    model: JSONEditorModel,
  },
  [CustomPropertyGridComponentTypes.csDocsPropertiesDropdown]: {
    component: CsDocsPropertiesDropdownComponent,
    model: QuestionCsDocsPropertiesDropdownModel,
  },
  [CustomPropertyGridComponentTypes.acceptedTypesValues]: {
    component: AcceptedValueTypesTextComponent,
    model: QuestionAcceptedValueTypesTextModel,
  },
};
