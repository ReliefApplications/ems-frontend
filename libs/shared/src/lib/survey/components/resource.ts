import { Apollo } from 'apollo-angular';
import {
  GET_SHORT_RESOURCE_BY_ID,
  GET_RESOURCE_BY_ID,
} from '../graphql/queries';
import {
  ComponentCollection,
  JsonMetadata,
  Question,
  Serializer,
  SurveyModel,
  SvgRegistry,
} from 'survey-core';
import { resourceConditions } from './resources';
import { Dialog } from '@angular/cdk/dialog';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import {
  buildSearchButton,
  buildAddButton,
  processNewCreatedRecords,
} from './utils';
import get from 'lodash/get';
import { Question as SharedQuestion, QuestionResource } from '../types';
import { Record } from '../../models/record.model';
import { Injector, NgZone } from '@angular/core';
import { registerCustomPropertyEditor } from './utils/component-register';
import { CustomPropertyGridComponentTypes } from './utils/components.enum';
import { ResourceQueryResponse } from '../../models/resource.model';

/** Question's temporary records */
export const temporaryRecordsForm = new FormControl([]);

/** Cache for loaded records */
const loadedRecords: Map<string, Record> = new Map();

/**
 * Adds the selected record to the survey context.
 *
 * @param question resource question
 * @param recordID id of record to add context of
 */
const addRecordToSurveyContext = (question: Question, recordID: string) => {
  const survey = question.survey as SurveyModel;
  if (!recordID) {
    // get survey variables
    survey.getVariableNames().forEach((variable) => {
      // remove variable if starts with question name
      if (variable.startsWith(`${question.name}.`))
        survey.setVariable(variable, null);
    });
    return;
  }
  // get record from cache
  const record = loadedRecords.get(recordID);
  if (!record) return;

  const data = record?.data || {};
  for (const field in data) {
    // create survey expression in the format {[questionName].[fieldName]} = [value]
    survey.setVariable(`${question.name}.${field}`, data[field]);
  }
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
        loadedRecords.set(x.node?.id || '', x.node);
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

  let filters: { field: string; operator: string; value: string }[] = [
    {
      field: '',
      operator: '',
      value: '',
    },
  ];

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
            getResourceById({ id: obj.resource }).subscribe(({ data }) => {
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

      // Build set available grid fields button
      serializer.addProperty('resource', {
        name: 'Search resource table',
        type: CustomPropertyGridComponentTypes.resourcesAvailableFields,
        isRequired: true,
        category: 'Custom Questions',
        dependsOn: ['resource'],
        visibleIf: (obj: null | QuestionResource) => !!obj && !!obj.resource,
        visibleIndex: 5,
      });

      serializer.addProperty('resource', {
        name: 'addTemplate',
        category: 'Custom Questions',
        dependsOn: ['addRecord', 'resource'],
        visibleIf: (obj: null | QuestionResource) => !!obj && !!obj.addRecord,
        visibleIndex: 3,
        choices: (obj: QuestionResource, choicesCallback: any) => {
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
      serializer.addProperty('resource', {
        name: 'selectQuestion:dropdown',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'displayField'],
        required: true,
        visibleIf: visibleIfResourceAndDisplayField,
        visibleIndex: 3,
        choices: (obj: QuestionResource, choicesCallback: any) => {
          if (obj && obj.resource) {
            const questions: any[] = [
              '',
              { value: '#staticValue', text: 'Set from static value' },
            ];
            (obj.survey as SurveyModel)
              .getAllQuestions()
              .forEach((question: SharedQuestion) => {
                if (question.id !== obj.id) {
                  questions.push(question.name);
                }
              });
            choicesCallback(questions);
          }
        },
      });
      serializer.addProperty('resource', {
        type: 'string',
        name: 'staticValue',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'selectQuestion', 'displayField'],
        visibleIf: (obj: null | QuestionResource) =>
          obj?.selectQuestion === '#staticValue' && obj.displayField,
        visibleIndex: 3,
      });
      serializer.addProperty('resource', {
        type: 'dropdown',
        name: 'filterBy',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'displayField', 'selectQuestion'],
        visibleIf: (obj: null | QuestionResource) =>
          !!obj && !!obj.selectQuestion && !!obj.displayField,
        choices: (obj: QuestionResource, choicesCallback: any) => {
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
      serializer.addProperty('resource', {
        type: 'dropdown',
        name: 'filterCondition',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'displayField', 'selectQuestion'],
        visibleIf: (obj: null | QuestionResource) =>
          !!obj && obj.resource && obj.displayField && obj.selectQuestion,
        choices: (obj: QuestionResource, choicesCallback: any) => {
          const questionByName: any =
            obj.survey.getQuestionByName(obj.selectQuestion) ||
            obj.customQuestion;
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
      serializer.addProperty('resource', {
        category: 'Filter by Questions',
        name: 'selectResourceText:boolean',
        type: CustomPropertyGridComponentTypes.resourceSelectText,
        displayName: 'Select a resource',
        dependsOn: ['resource', 'displayField'],
        visibleIf: visibleIfResourceAndDisplayField,
        visibleIndex: 3,
      });
      serializer.addProperty('resource', {
        name: 'gridFieldsSettings',
        dependsOn: ['resource'],
        visibleIf: (obj: null | QuestionResource) => {
          if (obj) {
            obj.gridFieldsSettings = obj.resource
              ? obj.gridFieldsSettings
              : new UntypedFormGroup({}).getRawValue();
          }
          return false;
        },
      });

      registerCustomPropertyEditor(
        CustomPropertyGridComponentTypes.resourceSelectText
      );

      serializer.addProperty('resource', {
        category: 'Filter by Questions',
        type: CustomPropertyGridComponentTypes.resourceCustomFilters,
        name: 'customFilterEl',
        displayName: 'Custom Filter',
        dependsOn: ['resource', 'selectQuestion'],
        visibleIf: (obj: null | QuestionResource) =>
          obj && obj.resource && !obj.selectQuestion,
        visibleIndex: 3,
      });

      registerCustomPropertyEditor(
        CustomPropertyGridComponentTypes.resourceCustomFilters
      );

      serializer.addProperty('resource', {
        category: 'Filter by Questions',
        type: 'text',
        name: 'customFilter',
        displayName: ' ',
        dependsOn: ['resource', 'selectQuestion'],
        visibleIf: (obj: null | QuestionResource) =>
          obj && obj.resource && !obj.selectQuestion,
        visibleIndex: 4,
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
    },
    /**
     * Get the resource after the question is loaded
     *
     * @param question The current resource question
     */
    onLoaded(question: QuestionResource): void {
      if (question.placeholder) {
        question.contentQuestion.optionsCaption = question.placeholder;
      }
      if (question.resource) {
        if (question.selectQuestion) {
          filters[0].operator = question.filterCondition;
          filters[0].field = question.filterBy;
          question.registerFunctionOnPropertyValueChanged(
            'filterCondition',
            () => {
              filters.map((i: any) => {
                i.operator = question.filterCondition;
              });
            }
          );
        }
        if (!question.filterBy || question.filterBy.length < 1) {
          this.populateChoices(question);
        }

        if (question.selectQuestion) {
          if (question.selectQuestion === '#staticValue') {
            setAdvanceFilter(question.staticValue, question);
            this.populateChoices(question);
          } else {
            (question.survey as SurveyModel).onValueChanged.add(
              (_: any, options: any) => {
                if (options.name === question.selectQuestion) {
                  if (
                    !!options.value ||
                    (options.question.customQuestion &&
                      options.question.customQuestion.name)
                  ) {
                    setAdvanceFilter(options.value, question);
                    this.populateChoices(question);
                  }
                }
              }
            );
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
                const quest = objElement.value.substr(
                  1,
                  objElement.value.length - 2
                );
                objElement.value = '';
                (question.survey as SurveyModel).onValueChanged.add(
                  (_: any, options: any) => {
                    if (options.question.name === quest) {
                      if (options.value) {
                        setAdvanceFilter(options.value, objElement.field);
                        this.populateChoices(question);
                      }
                    }
                  }
                );
              }
            }
            filters = obj;
            this.populateChoices(question);
          }
        }
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
        this.filters = [];
        this.resourceFieldsName = [];
        question.addRecord = false;
        question.addTemplate = null;
        question.prefillWithCurrentRecord = false;
      }
    },
    populateChoices: (question: QuestionResource): void => {
      if (question.resource) {
        getResourceRecordsById({ id: question.resource, filters }).subscribe(
          ({ data }) => {
            const choices = mapQuestionChoices(data, question);
            question.contentQuestion.choices = choices;
            if (!question.placeholder) {
              question.contentQuestion.optionsCaption =
                'Select a record from ' + data.resource.name + '...';
            }
            addRecordToSurveyContext(question, question.value);
          }
        );
      } else {
        question.contentQuestion.choices = [];
      }
    },
    // Display of add button for resource question
    onAfterRender: (question: QuestionResource, el: HTMLElement): void => {
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
        el.parentElement?.querySelector('#actionsButtons')?.remove();
        const actionsButtons = document.createElement('div');
        actionsButtons.id = 'actionsButtons';
        actionsButtons.style.display = 'flex';
        actionsButtons.style.marginBottom = '0.5em';

        const searchBtn = buildSearchButton(
          question,
          question.gridFieldsSettings,
          false,
          dialog,
          temporaryRecordsForm,
          document
        );
        actionsButtons.appendChild(searchBtn);

        const addBtn = buildAddButton(
          question,
          false,
          dialog,
          ngZone,
          document
        );
        actionsButtons.appendChild(addBtn);

        const parentElement = el.querySelector('.sd-question__content');
        if (parentElement) {
          parentElement.insertBefore(actionsButtons, parentElement.firstChild);
        }

        // actionsButtons.style.display = ((!question.addRecord || !question.addTemplate) && !question.gridFieldsSettings) ? 'none' : '';

        question.registerFunctionOnPropertyValueChanged(
          'gridFieldsSettings',
          () => {
            searchBtn.style.display = question.gridFieldsSettings ? '' : 'none';
          }
        );
        question.registerFunctionOnPropertyValueChanged('canSearch', () => {
          searchBtn.style.display = question.canSearch ? '' : 'none';
        });
        question.registerFunctionOnPropertyValueChanged('addTemplate', () => {
          addBtn.style.display =
            question.addRecord && question.addTemplate ? '' : 'none';
        });
        question.registerFunctionOnPropertyValueChanged('addRecord', () => {
          addBtn.style.display =
            question.addRecord && question.addTemplate && !question.isReadOnly
              ? ''
              : 'none';
        });

        const survey: SurveyModel = question.survey as SurveyModel;

        // Listen to value changes
        survey.onValueChanged.add((_, options) => {
          addRecordToSurveyContext(options.question, options.value);
        });
      }
    },
  };
  componentCollectionInstance.add(component);

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
};
