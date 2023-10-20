import { Apollo } from 'apollo-angular';
import {
  GET_SHORT_RESOURCE_BY_ID,
  GET_RESOURCE_BY_ID,
} from '../graphql/queries';
import { BehaviorSubject } from 'rxjs';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { CoreGridComponent } from '../../components/ui/core-grid/core-grid.component';
import { DomService } from '../../services/dom/dom.service';
import {
  buildSearchButton,
  buildAddButton,
  processNewCreatedRecords,
} from './utils';
import { QuestionResource } from '../types';
import { Injector, NgZone } from '@angular/core';
import {
  ComponentCollection,
  JsonObject,
  Serializer,
  SurveyModel,
  SvgRegistry,
} from 'survey-core';
import { registerCustomPropertyEditor } from './utils/component-register';
import { CustomPropertyGridComponentTypes } from './utils/components.enum';
import { ResourceQueryResponse } from '../../models/resource.model';

/** Create the list of filter values for resources */
export const resourcesFilterValues = new BehaviorSubject<
  { field: string; operator: string; value: string }[]
>([{ field: '', operator: '', value: '' }]);

/** List of operators for the resource conditions */
export const resourceConditions = [
  { value: '=', text: 'equals' },
  { value: '!=', text: 'not equals' },
  { value: 'contains', text: 'contains' },
  { value: '>', text: 'greater' },
  { value: '<', text: 'less' },
  { value: '>=', text: 'greater or equals' },
  { value: '<=', text: 'less or equals' },
];

/** Question temporary records */
const temporaryRecordsForm = new FormControl([]);

/**
 * Inits the resources question component for survey.
 *
 * @param injector Parent instance angular injector containing all needed services and directives
 * @param componentCollectionInstance ComponentCollection
 * @param ngZone Angular Service to execute code inside Angular environment
 * @param document Document
 */
export const init = (
  injector: Injector,
  componentCollectionInstance: ComponentCollection,
  ngZone: NgZone,
  document: Document
): void => {
  const domService = injector.get(DomService);
  const apollo = injector.get(Apollo);
  const dialog = injector.get(Dialog);

  const getResourceById = (data: { id: string }) =>
    apollo.query<ResourceQueryResponse>({
      query: GET_SHORT_RESOURCE_BY_ID,
      variables: {
        id: data.id,
      },
    });

  const mapQuestionChoices = (data: any, question: any) => {
    return (
      data.resource.records?.edges?.map((x: any) => {
        return {
          value: x.node?.id,
          text: x.node?.data[question.displayField || 'id'],
        };
      }) || []
    );
  };

  const getResourceRecordsById = (data: {
    id: string;
    filters?: { field: string; operator: string; value: string }[];
  }) =>
    apollo.query<ResourceQueryResponse>({
      query: GET_RESOURCE_BY_ID,
      variables: {
        id: data.id,
        filter: data.filters,
      },
      fetchPolicy: 'no-cache',
    });

  // const hasUniqueRecord = ((id: string) => false);
  // resourcesForms.filter(r => (r.id === id && r.coreForm && r.coreForm.uniqueRecord)).length > 0);

  let filters: { field: string; operator: string; value: string }[] = [
    {
      field: '',
      operator: '',
      value: '',
    },
  ];

  // registers icon-resources in the SurveyJS library
  SvgRegistry.registerIconFromSvg(
    'resources',
    '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="18px" viewBox="0 0 20 20" width="18px" fill="#000000"><g><rect fill="none" height="20" width="20" x="0"/></g><g><g><path d="M2.5,5H1v10.5C1,16.33,1.67,17,2.5,17h13.18v-1.5H2.5V5z"/><path d="M16.5,4H11L9,2H5.5C4.67,2,4,2.67,4,3.5v9C4,13.33,4.67,14,5.5,14h11c0.83,0,1.5-0.67,1.5-1.5v-7C18,4.67,17.33,4,16.5,4z M16.5,12.5h-11v-9h2.88l2,2h6.12V12.5z"/></g></g></svg>'
  );

  // Field visibility conditions callbacks
  const visibleIfResource = (obj: any) => {
    if (!obj || !obj.resource) {
      return false;
    } else {
      return true;
    }
  };

  const visibleIfResourceAndDisplayField = (obj: any) => {
    if (!obj || !obj.resource || !obj.displayField) {
      return false;
    } else {
      return true;
    }
  };

  const component = {
    name: 'resources',
    title: 'Resources',
    iconName: 'icon-resources',
    category: 'Custom Questions',
    questionJSON: {
      name: 'resources',
      type: 'tagbox',
      optionsCaption: 'Select a record...',
      choicesOrder: 'asc',
      choices: [] as any[],
    },
    resourceFieldsName: [] as any[],
    onInit: (): void => {
      Serializer.addProperty('resources', {
        name: 'resource',
        category: 'Custom Questions',
        type: CustomPropertyGridComponentTypes.resourcesDropdown,
        visibleIndex: 3,
        required: true,
      });

      registerCustomPropertyEditor(
        CustomPropertyGridComponentTypes.resourcesDropdown
      );
      Serializer.addProperty('resources', {
        name: 'displayField',
        category: 'Custom Questions',
        dependsOn: 'resource',
        required: true,
        visibleIf: visibleIfResource,
        visibleIndex: 3,
        choices: (obj: any, choicesCallback: any) => {
          if (obj.resource) {
            getResourceById({ id: obj.resource }).subscribe(({ data }) => {
              const choices = (data.resource.fields || [])
                .filter((item: any) => item.type !== 'matrix')
                .map((item: any) => {
                  return { value: item.name };
                });
              choices.unshift({ value: null });
              choicesCallback(choices);
            });
          }
        },
      });

      Serializer.addProperty('resources', {
        name: 'relatedName',
        category: 'Custom Questions',
        dependsOn: 'resource',
        required: true,
        description: 'unique name for this resource question',
        visibleIf: visibleIfResource,
        visibleIndex: 4,
      });

      // Build set available grid fields button
      JsonObject.metaData.addProperty('resources', {
        name: 'Search resource table',
        type: CustomPropertyGridComponentTypes.resourcesAvailableFields,
        isRequired: true,
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: visibleIfResource,
        visibleIndex: 5,
      });

      registerCustomPropertyEditor(
        CustomPropertyGridComponentTypes.resourcesAvailableFields
      );

      Serializer.addProperty('resources', {
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

      Serializer.addProperty('resources', {
        name: 'displayAsGrid:boolean',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: visibleIfResource,
        visibleIndex: 3,
      });
      Serializer.addProperty('resources', {
        name: 'addRecord:boolean',
        displayName: 'Add new records',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: visibleIfResource,
        visibleIndex: 2,
      });
      Serializer.addProperty('resources', {
        name: 'canDelete:boolean',
        displayName: 'Delete records',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: visibleIfResource,
        visibleIndex: 3,
      });
      Serializer.addProperty('resources', {
        name: 'history:boolean',
        displayName: 'Show history',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: visibleIfResource,
        visibleIndex: 3,
      });
      Serializer.addProperty('resources', {
        name: 'convert:boolean',
        displayName: 'Convert records',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: visibleIfResource,
        visibleIndex: 3,
      });
      Serializer.addProperty('resources', {
        name: 'update:boolean',
        dislayName: 'Update records',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: visibleIfResource,
        visibleIndex: 3,
      });
      Serializer.addProperty('resources', {
        name: 'inlineEdition:boolean',
        displayName: 'Inline edition',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: visibleIfResource,
        visibleIndex: 3,
      });
      Serializer.addProperty('resources', {
        name: 'export:boolean',
        displayName: 'Export records',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: visibleIfResource,
        visibleIndex: 3,
      });
      Serializer.addProperty('resources', {
        name: 'canSearch:boolean',
        category: 'Custom Questions',
        dependsOn: 'resource',
        default: true,
        visibleIf: visibleIfResource,
        visibleIndex: 3,
      });
      Serializer.addProperty('resources', {
        name: 'addTemplate',
        category: 'Custom Questions',
        dependsOn: ['addRecord', 'resource'],
        visibleIf: (obj: any) => {
          if (!obj.resource || !obj.addRecord) {
            return false;
          } else {
            return true;
            // const uniqueRecord = hasUniqueRecord(obj.resource);
            // if (uniqueRecord) {
            //   obj.addRecord = false;
            // }
            // return !uniqueRecord;
          }
        },
        visibleIndex: 3,
        choices: (obj: any, choicesCallback: any) => {
          if (obj.resource && obj.addRecord) {
            getResourceById({ id: obj.resource }).subscribe(({ data }) => {
              const choices = (data.resource.forms || []).map((item: any) => {
                return { value: item.id, text: item.name };
              });
              choices.unshift({ value: null, text: '' });
              choicesCallback(choices);
            });
          }
        },
      });
      Serializer.addProperty('resources', {
        name: 'prefillWithCurrentRecord:boolean',
        category: 'Custom Questions',
        dependsOn: ['addRecord', 'resource'],
        visibleIf: (obj: any) => {
          if (!obj.resource || !obj.addRecord) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 8,
      });
      Serializer.addProperty('resources', {
        name: 'selectQuestion:dropdown',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'displayField'],
        required: true,
        visibleIf: visibleIfResourceAndDisplayField,
        visibleIndex: 3,
        choices: (obj: any, choicesCallback: any) => {
          if (obj && obj.resource) {
            const questions: any[] = [
              '',
              { value: '#staticValue', text: 'Set from static value' },
            ];
            obj.survey.getAllQuestions().forEach((question: any) => {
              if (question.id !== obj.id) {
                questions.push(question.name);
              }
            });
            choicesCallback(questions);
          }
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      Serializer.addProperty('resources', {
        name: 'gridFieldsSettings',
        dependsOn: 'resource',
        visibleIf: (obj: any) => {
          obj.gridFieldsSettings = obj.resource
            ? obj.gridFieldsSettings
            : new UntypedFormGroup({}).getRawValue();
          return false;
        },
      });
      Serializer.addProperty('resources', {
        type: 'string',
        name: 'staticValue',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'selectQuestion', 'displayField'],
        visibleIf: (obj: any) =>
          obj.selectQuestion === '#staticValue' && obj.displayField,
        visibleIndex: 3,
      });
      Serializer.addProperty('resources', {
        type: 'dropdown',
        name: 'filterBy',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'displayField', 'selectQuestion'],
        visibleIf: (obj: any) => obj.selectQuestion && obj.displayField,
        choices: (obj: any, choicesCallback: any) => {
          if (obj.resource) {
            getResourceById({ id: obj.resource }).subscribe(({ data }) => {
              const choices = (data.resource.fields || []).map((item: any) => {
                return { value: item.name };
              });
              choicesCallback(choices);
            });
          }
        },
        visibleIndex: 3,
      });
      Serializer.addProperty('resources', {
        type: 'dropdown',
        name: 'filterCondition',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'displayField', 'selectQuestion'],
        visibleIf: (obj: any) =>
          obj.resource && obj.displayField && obj.selectQuestion,
        choices: (obj: any, choicesCallback: any) => {
          const questionByName = obj.survey.getQuestionByName(
            obj.selectQuestion
          )
            ? obj.survey.getQuestionByName(obj.selectQuestion)
            : obj.customQuestion;
          if (questionByName && questionByName.inputType === 'date') {
            choicesCallback(
              resourceConditions.filter((r) => r.value !== 'contains')
            );
          } else {
            choicesCallback(resourceConditions);
          }
        },
        visibleIndex: 3,
      });
      Serializer.addProperty('resources', {
        category: 'Filter by Questions',
        type: CustomPropertyGridComponentTypes.resourceSelectText,
        name: 'selectResourceText',
        displayName: 'Select a resource',
        dependsOn: ['resource', 'displayField'],
        visibleIf: (obj: any) => !obj.resource || !obj.displayField,
        visibleIndex: 3,
      });

      registerCustomPropertyEditor(
        CustomPropertyGridComponentTypes.resourceSelectText
      );

      Serializer.addProperty('resources', {
        category: 'Filter by Questions',
        type: 'customFilter',
        name: 'customFilterEl',
        displayName: 'Custom Filter',
        dependsOn: ['resource', 'selectQuestion'],
        visibleIf: (obj: any) => obj.resource && !obj.selectQuestion,
        visibleIndex: 3,
      });

      Serializer.addProperty('resources', {
        category: 'Filter by Questions',
        type: 'text',
        name: 'customFilter',
        displayName: ' ',
        dependsOn: ['resource', 'selectQuestion'],
        visibleIf: (obj: any) => obj.resource && !obj.selectQuestion,
        visibleIndex: 4,
      });

      Serializer.addProperty('resources', {
        name: 'newCreatedRecords',
        category: 'Custom Questions',
        visible: false,
      });

      Serializer.addProperty('resources', {
        name: 'afterRecordCreation',
        // type: 'expression',
        category: 'logic',
      });

      Serializer.addProperty('resources', {
        name: 'afterRecordSelection',
        // type: 'expression',
        category: 'logic',
      });
    },
    /**
     * Fetch the resources when the question is loaded
     *
     * @param question The current question.
     */
    onLoaded(question: any): void {
      if (question.placeholder) {
        question.contentQuestion.optionsCaption = question.placeholder;
      }
      if (question.resource) {
        if (question.selectQuestion) {
          if (filters.length === 0) {
            filters = [
              {
                field: '',
                operator: '',
                value: '',
              },
            ];
          }
          filters[0].operator = question.filterCondition;
          filters[0].field = question.filterBy;
          if (question.displayAsGrid) {
            resourcesFilterValues.next(filters);
          }
          question.registerFunctionOnPropertyValueChanged(
            'filterCondition',
            () => {
              const resourcesFilters = resourcesFilterValues.getValue();
              resourcesFilters[0].operator = question.filterCondition;
              resourcesFilterValues.next(resourcesFilters);
              resourcesFilters.map((i: any) => {
                i.operator = question.filterCondition;
              });
            }
          );
          if (!question.filterBy || question.filterBy.length < 1) {
            this.populateChoices(question);
          }
        }
        getResourceById({ id: question.resource }).subscribe(({ data }) => {
          // const choices = mapQuestionChoices(data, question);
          // question.contentQuestion.choices = choices;
          if (!question.placeholder) {
            question.contentQuestion.optionsCaption =
              'Select a record from ' + data.resource.name + '...';
          }
        });
        if (question.selectQuestion) {
          if (question.selectQuestion === '#staticValue') {
            setAdvanceFilter(question.staticValue, question);
            this.populateChoices(question);
          } else {
            question.survey?.onValueChanged.add((_: any, options: any) => {
              if (options.name === question.selectQuestion) {
                if (!!options.value || options.question.customQuestion) {
                  setAdvanceFilter(options.value, question);
                  if (question.displayAsGrid) {
                    resourcesFilterValues.next(filters);
                  } else {
                    this.populateChoices(question);
                  }
                }
              }
            });
          }
        } else if (
          !question.selectQuestion &&
          question.customFilter &&
          question.customFilter.trim().length > 0
        ) {
          const obj = JSON.parse(question.customFilter);
          if (obj) {
            for (const objElement of obj) {
              const value = objElement.value;
              if (typeof value === 'string' && value.match(/^{*.*}$/)) {
                const quest = value.substr(1, value.length - 2);
                objElement.value = '';
                question.survey?.onValueChanged.add((_: any, options: any) => {
                  if (options.question.name === quest) {
                    if (options.value) {
                      setAdvanceFilter(options.value, objElement.field);
                      if (question.displayAsGrid) {
                        resourcesFilterValues.next(filters);
                      } else {
                        this.populateChoices(question, objElement.field);
                      }
                    }
                  }
                });
              }
            }
            filters = obj;
            this.populateChoices(question);
          }
        }
      }
    },
    populateChoices: (question: any, field?: string): void => {
      if (question.displayAsGrid) {
        if (question.selectQuestion) {
          const f = field ? field : question.filterBy;
          const obj = filters.filter((i: any) => i.field === f);
          if (obj.length > 0) {
            resourcesFilterValues.next(obj);
          }
        } else if (question.customFilter) {
          resourcesFilterValues.next(filters);
        }
      } else {
        getResourceRecordsById({ id: question.resource, filters }).subscribe(
          ({ data }) => {
            const choices = mapQuestionChoices(data, question);
            question.contentQuestion.choices = choices;
          }
        );
      }
    },
    /**
     * Update question properties when the resource property is changed
     *
     * @param question The current question
     * @param propertyName The name of the property
     */
    onPropertyChanged(question: any, propertyName: string): void {
      if (propertyName === 'resource') {
        question.displayField = null;
        filters = [];
        this.resourceFieldsName = [];
        question.addRecord = false;
        question.addTemplate = null;
        question.prefillWithCurrentRecord = false;
      }
    },
    onAfterRender: (question: QuestionResource, el: any): void => {
      // hide tagbox if grid view is enable
      setTimeout(() => {
        if (question.displayAsGrid) {
          const element = el.parentElement?.querySelector('#tagbox');
          if (element) {
            element.style.display = 'none';
          }
        }
      }, 500);
      // Display the add button | grid for resources question
      if (question.resource) {
        const parentElement = el.querySelector('.sd-question__content');
        if (parentElement) {
          const instance: CoreGridComponent =
            buildRecordsGrid(question, parentElement.firstChild) || undefined;
          if (instance) {
            instance.removeRowIds.subscribe((ids) => {
              question.value = question.value.filter(
                (id: string) => !ids.includes(id)
              );
            });
          }
          if ((question.survey as SurveyModel).mode !== 'display') {
            el.parentElement.querySelector('#actionsButtons')?.remove();
            const actionsButtons = document.createElement('div');
            actionsButtons.id = 'actionsButtons';
            actionsButtons.style.display = 'flex';
            actionsButtons.style.marginBottom = '0.5em';

            const searchBtn = buildSearchButton(
              question,
              question.gridFieldsSettings,
              true,
              dialog,
              temporaryRecordsForm,
              document
            );
            actionsButtons.appendChild(searchBtn);

            const addBtn = buildAddButton(
              question,
              true,
              dialog,
              ngZone,
              document
            );
            actionsButtons.appendChild(addBtn);

            parentElement.insertBefore(
              actionsButtons,
              parentElement.firstChild
            );
            // actionsButtons.style.display = ((!question.addRecord || !question.addTemplate) && !question.gridFieldsSettings) ? 'none' : '';

            question.registerFunctionOnPropertyValueChanged(
              'gridFieldsSettings',
              () => {
                searchBtn.style.display = question.gridFieldsSettings
                  ? ''
                  : 'none';
              }
            );
            question.registerFunctionOnPropertyValueChanged('canSearch', () => {
              searchBtn.style.display = question.canSearch ? '' : 'none';
            });
            question.registerFunctionOnPropertyValueChanged(
              'addTemplate',
              () => {
                addBtn.style.display =
                  question.addRecord && question.addTemplate ? '' : 'none';
              }
            );
            question.registerFunctionOnPropertyValueChanged('addRecord', () => {
              addBtn.style.display =
                question.addRecord &&
                question.addTemplate &&
                !question.isReadOnly
                  ? ''
                  : 'none';
            });
          }
        }
      }
    },
  };
  componentCollectionInstance.add(component);

  /**
   * Set an advance filter
   *
   * @param value Value of the filter
   * @param question The question object
   */
  const setAdvanceFilter = (value: string, question: string | any) => {
    const field = typeof question !== 'string' ? question.filterBy : question;
    if (!filters.some((x: any) => x.field === field)) {
      filters.push({
        field: question.filterBy,
        operator: question.filterCondition,
        value,
      });
    } else {
      filters.map((x: any) => {
        if (x.field === field) {
          x.value = value;
        }
      });
    }
  };

  /**
   * Build the grid with the records
   *
   * @param question The resources question
   * @param el The html element in which we want to build the grid
   * @returns The CoreGridComponent, or null if the displayAsGrid property
   * of the question object is false
   */
  const buildRecordsGrid = (question: any, el: any): any => {
    let instance: CoreGridComponent;
    if (question.displayAsGrid) {
      const grid = domService.appendComponentToBody(
        CoreGridComponent,
        el.parentElement
      );
      instance = grid.instance;
      setGridInputs(instance, question);
      question.survey?.onValueChanged.add((_: any, options: any) => {
        if (options.name === question.name) {
          setGridInputs(instance, question);
        }
      });
      return instance;
    }
    return null;
  };

  /**
   * Sets the inputs of the grid.
   *
   * @param instance grid instance.
   * @param question survey question.
   */
  const setGridInputs = async (instance: CoreGridComponent, question: any) => {
    instance.multiSelect = true;
    const promises: any[] = [];
    const settings = await processNewCreatedRecords(question, true, promises);
    if (!question.readOnlyGrid) {
      Object.assign(settings, {
        actions: {
          delete: question.canDelete,
          history: question.history,
          convert: question.convert,
          update: question.update,
          inlineEdition: question.inlineEdition,
          remove: true,
        },
      });
    }
    // If search button exists, updates grid displayed records
    if (question.canSearch) {
      temporaryRecordsForm.setValue(settings.query.temporaryRecords);
    }
    instance.settings = settings;
    Promise.allSettled(promises).then(() => {
      instance.configureGrid();
    });
  };
};
