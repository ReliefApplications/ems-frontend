import { Dialog } from '@angular/cdk/dialog';
import { Injector, NgZone } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import { Apollo } from 'apollo-angular';
import { isEqual, isNil } from 'lodash';
import get from 'lodash/get';
import {
  ComponentCollection,
  JsonMetadata,
  Question,
  Serializer,
  SurveyModel,
  SvgRegistry,
} from 'survey-core';
import { RecordQueryResponse } from '../../models/record.model';
import { ResourceQueryResponse } from '../../models/resource.model';
import {
  GET_RESOURCE_QUESTION_RECORD,
  GET_SHORT_RESOURCE_BY_ID,
} from '../graphql/queries';
import { QuestionResource } from '../types';
import {
  buildAddButton,
  buildSearchButton,
  canShowSearchButton,
  processNewCreatedRecords,
  setUpActionsButtonWrapper,
} from './utils';
import { registerCustomPropertyEditor } from './utils/component-register';
import { CustomPropertyGridComponentTypes } from './utils/components.enum';
import { setupResourceChoicesLoader } from './utils/resource-records-loader';

/** Question temporary records */
const temporaryRecordsForm = new FormControl([]);

/**
 * Sets the survey variables of the selected record, in the format
 * {[questionName].[fieldName]} = [value]. Variables of the previously
 * selected record are cleared first.
 *
 * @param question resource question
 * @param data data of the selected record, or null if no record is selected
 */
const setRecordVariables = (question: Question, data: any | null): void => {
  const survey = question.survey as SurveyModel;
  if (!survey) {
    return;
  }
  const prefix = `${question.name}.`;
  survey.getVariableNames().forEach((variable) => {
    if (variable.startsWith(prefix)) {
      survey.setVariable(variable, null);
    }
  });
  for (const field in data || {}) {
    survey.setVariable(`${prefix}${field}`, data[field]);
  }
};

/**
 * Adds the selected record to the survey context.
 * The record data ( including calculated fields ) is fetched, then exposed
 * as survey variables.
 *
 * @param apollo Apollo client
 * @param question resource question
 * @param recordID id of record to add context of
 */
const addRecordToSurveyContext = (
  apollo: Apollo,
  question: Question,
  recordID: string | null | undefined
): void => {
  // Ignore responses of previous selections
  const requestId = ((question as any)._recordContextRequest =
    ((question as any)._recordContextRequest || 0) + 1);
  if (!recordID) {
    setRecordVariables(question, null);
    return;
  }
  // Records created from the question are drafts, not saved yet: use their data
  const draft = (question as any).draftData?.[recordID];
  if (draft) {
    setRecordVariables(question, draft);
    return;
  }
  apollo
    .query<RecordQueryResponse>({
      query: GET_RESOURCE_QUESTION_RECORD,
      variables: { id: recordID },
      fetchPolicy: 'no-cache',
    })
    .subscribe({
      next: ({ data }) => {
        if ((question as any)._recordContextRequest !== requestId) {
          return;
        }
        setRecordVariables(question, data?.record?.data || null);
      },
      error: () => {
        if ((question as any)._recordContextRequest !== requestId) {
          return;
        }
        setRecordVariables(question, null);
      },
    });
};

/**
 * Inits the resource question component of for survey.
 *
 * @param injector Parent instance angular injector containing all needed services and directives
 * @param componentCollectionInstance Survey component collection instance
 * @param ngZone Angular Service to execute code inside Angular environment
 * @param document Document
 */
export const init = (
  injector: Injector,
  componentCollectionInstance: ComponentCollection,
  ngZone: NgZone,
  document: Document
): void => {
  const apollo = injector.get(Apollo);
  const dialog = injector.get(Dialog);

  /**
   * Get resource by id
   *
   * @param id resource id
   * @returns Apollo query to get resource
   */
  const getResourceById = (id: string) =>
    apollo.query<ResourceQueryResponse>({
      query: GET_SHORT_RESOURCE_BY_ID,
      variables: {
        id,
      },
    });

  /**
   * Update question filter based on survey data
   *
   * @param data survey data
   * @param filter question filter
   * @returns updated filter
   */
  const updateFilter = (
    data: any,
    filter: CompositeFilterDescriptor | FilterDescriptor
  ): CompositeFilterDescriptor | FilterDescriptor | null => {
    if ('filters' in filter) {
      return {
        logic: filter.logic,
        filters: filter.filters
          .map((x) => updateFilter(data, x))
          .filter((x) => !isNil(x)) as (
          | FilterDescriptor
          | CompositeFilterDescriptor
        )[],
      };
    } else {
      // Extract the placeholder (if present)
      const matches = filter.value.match(/\{([^}]+)\}/);
      if (matches) {
        const field = matches[1]; // extract the part between { }
        const value = get(data, field);
        if (isNil(value)) {
          return null;
        } else {
          return {
            ...filter,
            value,
          };
        }
      } else {
        return filter;
      }
    }
  };

  /**
   * Build the question filters, from the custom filter and the survey data
   *
   * @param question Current question
   * @returns Question filters
   */
  const buildQuestionFilters = (
    question: any
  ): CompositeFilterDescriptor | FilterDescriptor | null => {
    const surveyData = question.survey?.data;
    let customFilter: any;
    try {
      customFilter = JSON.parse(question.customFilter);
    } catch (error) {
      console.error('Invalid custom filter of resource question', error);
      return null;
    }
    if (Array.isArray(customFilter)) {
      return {
        logic: 'and',
        filters: customFilter
          .map((x) => updateFilter(surveyData, x))
          .filter((x) => !isNil(x)) as (
          | FilterDescriptor
          | CompositeFilterDescriptor
        )[],
      };
    }
    return updateFilter(surveyData, customFilter);
  };

  /**
   * Set up the loader of the question choices: records are searched on the
   * server, and fetched page by page with their display field only.
   *
   * @param question Current question
   */
  const setupChoicesLoader = (question: any): void => {
    const loader = setupResourceChoicesLoader(apollo, question);
    if (!loader) {
      return;
    }
    if (question.customFilter && question.autoSelectFirstOption) {
      // Automatically select the record when it is the only one available
      loader
        .load({ search: '', skip: 0, take: 1 })
        .subscribe(({ items, totalCount }) => {
          if (totalCount === 1 && items[0] && !question.value) {
            question.value = items[0].value;
          }
        });
    }
  };

  // const hasUniqueRecord = ((id: string) => false);
  // resourcesForms.filter(r => (r.id === id && r.coreForm && r.coreForm.uniqueRecord)).length > 0);

  // registers icon-resource in the SurveyJS library
  SvgRegistry.registerIconFromSvg(
    'resource',
    '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>'
  );

  const visibleIfResource = (obj: QuestionResource) => {
    if (!obj || !obj.resource) {
      return false;
    } else {
      return true;
    }
  };

  const visibleIfResourceAndDisplayField = (obj: QuestionResource) => {
    if (!obj || !obj.resource || !obj.displayField) {
      return false;
    } else {
      return true;
    }
  };

  const component = {
    name: 'resource',
    title: 'Resource',
    iconName: 'icon-resource',
    category: 'Custom Questions',
    questionJSON: {
      name: 'resource',
      type: 'dropdown',
      optionsCaption: 'Select a record...',
      choicesOrder: 'asc',
      choices: [] as any[],
    },
    filters: [] as any[],
    resourceFieldsName: [] as any[],
    /** Initiate the resource question component */
    onInit(): void {
      const serializer: JsonMetadata = Serializer;
      serializer.addProperty('resource', {
        name: 'resource',
        category: 'Custom Questions',
        type: CustomPropertyGridComponentTypes.resourcesDropdown,
        visibleIndex: 3,
        required: true,
      });

      registerCustomPropertyEditor(
        CustomPropertyGridComponentTypes.resourcesDropdown
      );

      serializer.addProperty('resource', {
        name: 'displayField',
        category: 'Custom Questions',
        dependsOn: 'resource',
        required: true,
        visibleIf: visibleIfResource,
        visibleIndex: 3,
        choices: (obj: QuestionResource, choicesCallback: any) => {
          if (obj.resource) {
            getResourceById(obj.resource).subscribe(({ data }) => {
              const choices = (data.resource.fields || [])
                .filter((item: any) => item.type !== 'matrix')
                .map((item: any) => {
                  return {
                    value: item.name,
                  };
                });
              choices.unshift({ value: null });
              choicesCallback(choices);
            });
          }
        },
      });

      serializer.addProperty('resource', {
        name: 'relatedName',
        category: 'Custom Questions',
        dependsOn: 'resource',
        required: true,
        description: 'unique name for this resource question',
        visibleIf: visibleIfResource,
        visibleIndex: 4,
      });

      // Build set available grid fields button
      serializer.addProperty('resource', {
        name: 'Search resource table',
        type: CustomPropertyGridComponentTypes.resourcesAvailableFields,
        isRequired: true,
        category: 'Custom Questions',
        dependsOn: ['resource'],
        visibleIf: visibleIfResource,
        visibleIndex: 5,
      });

      registerCustomPropertyEditor(
        CustomPropertyGridComponentTypes.resourcesAvailableFields
      );

      serializer.addProperty('resource', {
        name: 'test service',
        type: CustomPropertyGridComponentTypes.resourceTestService,
        category: 'Custom Questions',
        dependsOn: ['resource', 'displayField'],
        required: true,
        visibleIf: visibleIfResourceAndDisplayField,
        visibleIndex: 3,
      });

      registerCustomPropertyEditor(
        CustomPropertyGridComponentTypes.resourceTestService
      );

      serializer.addProperty('resource', {
        name: 'addRecord:boolean',
        category: 'Custom Questions',
        dependsOn: ['resource'],
        visibleIf: visibleIfResource,
        visibleIndex: 2,
      });
      serializer.addProperty('resource', {
        name: 'canSearch:boolean',
        category: 'Custom Questions',
        dependsOn: ['resource'],
        default: true,
        visibleIf: visibleIfResource,
        visibleIndex: 3,
      });

      serializer.addProperty('resource', {
        name: 'addTemplate',
        category: 'Custom Questions',
        dependsOn: ['addRecord', 'resource'],
        visibleIf: (obj: null | QuestionResource) => !!obj && !!obj.addRecord,
        visibleIndex: 3,
        choices: (obj: QuestionResource, choicesCallback: any) => {
          if (obj.resource && obj.addRecord) {
            getResourceById(obj.resource).subscribe(({ data }) => {
              const choices = (data.resource.forms || []).map((item: any) => {
                return { value: item.id, text: item.name };
              });
              choices.unshift({ value: null, text: '' });
              choicesCallback(choices);
            });
          }
        },
      });
      serializer.addProperty('resource', {
        name: 'placeholder',
        category: 'Custom Questions',
        isLocalizable: true,
      });
      serializer.addProperty('resource', {
        name: 'prefillWithCurrentRecord:boolean',
        category: 'Custom Questions',
        dependsOn: ['addRecord', 'resource'],
        visibleIf: (obj: null | QuestionResource) => !!obj && !!obj.addRecord,
        visibleIndex: 8,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      serializer.addProperty('resource', {
        name: 'gridFieldsSettings',
        dependsOn: 'resource',
        visibleIf: (obj: any) => {
          obj.gridFieldsSettings = obj.resource
            ? obj.gridFieldsSettings
            : new UntypedFormGroup({}).getRawValue();
          return false;
        },
      });

      serializer.addProperty('resource', {
        category: 'Dynamic filtering',
        type: CustomPropertyGridComponentTypes.resourceCustomFilters,
        name: 'customFilterEl',
        displayName: 'Custom Filter',
        dependsOn: ['resource'],
        visibleIf: (obj: null | QuestionResource) =>
          obj && !isNil(obj.resource),
        visibleIndex: 3,
      });

      registerCustomPropertyEditor(
        CustomPropertyGridComponentTypes.resourceCustomFilters
      );

      serializer.addProperty('resource', {
        category: 'Dynamic filtering',
        type: CustomPropertyGridComponentTypes.jsonEditor,
        name: 'customFilter',
        displayName: ' ',
        dependsOn: ['resource'],
        visibleIf: (obj: null | QuestionResource) =>
          obj && !isNil(obj.resource),
        visibleIndex: 4,
      });

      Serializer.addProperty('resource', {
        category: 'Dynamic filtering',
        type: 'boolean',
        name: 'autoSelectFirstOption',
        displayName:
          'Automatically selects the first option when only one option is available',
        dependsOn: ['resource'],
        visibleIf: (obj: any) =>
          obj && !isNil(obj.resource) && !!obj.customFilter,
        visibleIndex: 5,
      });

      serializer.addProperty('resource', {
        name: 'newCreatedRecords',
        category: 'Custom Questions',
        visible: false,
      });

      serializer.addProperty('resource', {
        name: 'afterRecordCreation',
        // type: 'expression',
        category: 'logic',
      });

      serializer.addProperty('resource', {
        name: 'afterRecordSelection',
        // type: 'expression',
        category: 'logic',
      });

      serializer.addProperty('resources', {
        name: 'filters',
        category: 'Custom Questions',
        visible: false,
        isSerializable: false,
      });
    },
    /**
     * Get the resource after the question is loaded
     *
     * @param question The current resource question
     */
    onLoaded(question: any): void {
      // Set placeholder
      if (question.placeholder) {
        question.contentQuestion.optionsCaption = question.placeholder;
      }
      // If question is valid
      if (question.resource) {
        // Expose the selected record as survey variables
        question.registerFunctionOnPropertyValueChanged(
          'value',
          () => addRecordToSurveyContext(apollo, question, question.value),
          'resourceContext'
        );
        addRecordToSurveyContext(apollo, question, question.value);

        // Compute the question filters before loading the records
        if (question.customFilter && question.customFilter.trim().length > 0) {
          /**
           * Update the question filters, and reload the choices when they change
           */
          const updateQuestionFilters = () => {
            const filters = buildQuestionFilters(question);
            if (!isEqual(filters, question.filters)) {
              question.filters = filters;
              setupChoicesLoader(question);
            }
          };

          // Subscribe to survey value changes
          question.survey?.onValueChanged.add(() => {
            updateQuestionFilters();
          });

          // Initial load
          updateQuestionFilters();
        }
        // Get the records query name & display field definition of the resource
        getResourceById(question.resource).subscribe(({ data }) => {
          const resource = data?.resource;
          if (!resource) {
            return;
          }
          question._resourceInfo = {
            queryName: resource.queryName,
            field: (resource.fields || []).find(
              (x: any) => x.name === question.displayField
            ),
          };
          if (!question.placeholder) {
            question.contentQuestion.optionsCaption =
              'Select a record from ' + resource.name + '...';
          }
          setupChoicesLoader(question);
        });

        if (question.addRecord && question.canSearch) {
          // If search button exists, updates grid displayed records when new records are created with the add button
          question.registerFunctionOnPropertyValueChanged(
            'newCreatedRecords',
            async () => {
              const settings = await processNewCreatedRecords(
                question,
                false,
                []
              );
              temporaryRecordsForm.setValue(settings.query.temporaryRecords);
            }
          );
        }
      }
    },
    /**
     * Update the question properties when the resource property is changed
     *
     * @param question The current question
     * @param propertyName The name of the property
     */
    onPropertyChanged(question: QuestionResource, propertyName: string): void {
      if (propertyName === 'resource') {
        question.displayField = null;
        this.resourceFieldsName = [];
        question.addRecord = false;
        question.addTemplate = null;
        question.prefillWithCurrentRecord = false;
      }
    },
    // Display of add button for resource question
    onAfterRender: (question: QuestionResource, el: HTMLElement): void => {
      const actionsButtons = setUpActionsButtonWrapper();
      const parentElement = el.querySelector('.sd-question__content');
      const searchBtn = buildSearchButton(
        question,
        question.gridFieldsSettings,
        false,
        dialog,
        temporaryRecordsForm,
        document,
        ngZone
      );
      // Hide search button by default
      searchBtn.style.display = 'none';
      // support the placeholder field
      if (question.placeholder) {
        question.contentQuestion.optionsCaption = get(
          question,
          'localizableStrings.placeholder.renderedText',
          ''
        );
      }
      if (
        (question.survey as SurveyModel).mode !== 'display' &&
        question.resource
      ) {
        searchBtn.style.display = canShowSearchButton(question)
          ? 'block'
          : 'none';
        const addBtn = buildAddButton(
          question,
          false,
          dialog,
          ngZone,
          document
        );
        actionsButtons.appendChild(addBtn);

        // actionsButtons.style.display = ((!question.addRecord || !question.addTemplate) && !question.gridFieldsSettings) ? 'none' : '';
        question.registerFunctionOnPropertyValueChanged('canSearch', () => {
          searchBtn.style.display = canShowSearchButton(question)
            ? 'block'
            : 'none';
        });
        question.registerFunctionOnPropertyValueChanged(
          'gridFieldsSettings',
          () => {
            // Fields were added/removed: re-evaluate whether the search
            // button should be visible (it needs at least one configured
            // field to be functional).
            searchBtn.style.display = canShowSearchButton(question)
              ? 'block'
              : 'none';
          }
        );
        question.registerFunctionOnPropertyValueChanged('addTemplate', () => {
          addBtn.style.display =
            question.addRecord && question.addTemplate ? 'block' : 'none';
        });
        question.registerFunctionOnPropertyValueChanged('addRecord', () => {
          addBtn.style.display =
            question.addRecord && question.addTemplate && !question.isReadOnly
              ? 'block'
              : 'none';
        });
      }
      actionsButtons.appendChild(searchBtn);
      if (parentElement) {
        parentElement.insertBefore(actionsButtons, parentElement.firstChild);
      }
      question.registerFunctionOnPropertyValueChanged('resource', () => {
        if (question.resource && question.canSearch) {
          searchBtn.style.display = 'block';
        }
      });
    },
  };
  componentCollectionInstance.add(component);
};
