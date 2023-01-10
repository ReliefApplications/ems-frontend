import { Apollo } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import {
  GET_RESOURCE_BY_ID,
  GetResourceByIdQueryResponse,
} from '../graphql/queries';
import { SafeCoreGridComponent } from '../../components/ui/core-grid/core-grid.component';
import { DomService } from '../../services/dom/dom.service';
import { buildSearchButton, buildAddButton } from './utils';
import { isNil } from 'lodash';

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

/**
 * Inits the resources question component for survey.
 *
 * @param Survey Survey library
 * @param domService Shared DOM service
 * @param apollo Apollo client
 * @param dialog Material dialog service
 */
export const init = (
  Survey: any,
  domService: DomService,
  apollo: Apollo,
  dialog: MatDialog
): void => {
  const getResourceById = (data: {
    id: string;
    filters?: { field: string; operator: string; value: string }[];
  }) =>
    apollo.query<GetResourceByIdQueryResponse>({
      query: GET_RESOURCE_BY_ID,
      variables: {
        id: data.id,
        filter: data.filters,
      },
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

  const component = {
    name: 'resources',
    title: 'Resources',
    category: 'Custom Questions',
    questionJSON: {
      name: 'resources',
      type: 'tagbox',
      choicesOrder: 'asc',
      choices: [] as any[],
    },
    resourceFieldsName: [] as any[],
    onInit: (): void => {
      // Resource selection
      Survey.Serializer.addProperty('resources', {
        name: 'resource',
        category: 'Custom Questions',
        type: 'resource-dropdown',
        visibleIndex: 3,
        required: true,
      });

      // Display field
      Survey.Serializer.addProperty('resources', {
        name: 'displayField',
        category: 'Custom Questions',
        dependsOn: 'resource',
        required: true,
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
        choices: (obj: any, choicesCallback: any) => {
          if (obj.resource) {
            getResourceById({ id: obj.resource }).subscribe((response) => {
              const serverRes = response.data.resource.fields;
              const res = [];
              res.push({ value: null });
              for (const item of serverRes) {
                if (item.type !== 'matrix') {
                  res.push({ value: item.name });
                }
              }
              choicesCallback(res);
            });
          }
        },
      });

      // Related name
      Survey.Serializer.addProperty('resources', {
        name: 'relatedName',
        category: 'Custom Questions',
        dependsOn: 'resource',
        required: true,
        description: 'unique name for this resource question',
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 4,
      });

      // Grid field settings
      Survey.Serializer.addProperty('resources', {
        name: 'gridFieldsSettings',
        display: 'Search resource table',
        type: 'resource-fields',
        isRequired: true,
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: (obj: any) => !!obj && !!obj.resource,
        visibleIndex: 5,
        default: new FormGroup({}).getRawValue(),
        onPropertyEditorUpdate: (obj: any, propertyEditor: any) => {
          if (!!obj?.resource) propertyEditor.resource = obj.resource;
        },
      });

      // Test service
      Survey.Serializer.addProperty('resources', {
        name: 'test service',
        category: 'Custom Questions',
        dependsOn: ['resource', 'displayField'],
        required: true,
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource || !obj.displayField) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
        choices: (obj: any, choicesCallback: any) => {
          if (obj.resource) {
            getResourceById({ id: obj.resource }).subscribe((response) => {
              const serverRes =
                response.data.resource.records?.edges?.map((x) => x.node) || [];
              const res = [];
              res.push({ value: null });
              for (const item of serverRes) {
                const text = item?.data[obj.displayField];
                res.push({
                  value: item?.id,
                  // this prevents displaying the ids if the value is a number
                  text: isNil(text) ? null : `${text}`,
                });
              }
              choicesCallback(res);
            });
          }
        },
      });

      // Display as grid
      Survey.Serializer.addProperty('resources', {
        name: 'displayAsGrid:boolean',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
      });

      // Add new records
      Survey.Serializer.addProperty('resources', {
        name: 'addRecord:boolean',
        displayName: 'Add new records',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
            // return !hasUniqueRecord(obj.resource);
          }
        },
        visibleIndex: 2,
      });

      // Delete records
      Survey.Serializer.addProperty('resources', {
        name: 'canDelete:boolean',
        displayName: 'Delete records',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
      });

      // Show history
      Survey.Serializer.addProperty('resources', {
        name: 'history:boolean',
        displayName: 'Show history',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
      });

      // Convert records
      Survey.Serializer.addProperty('resources', {
        name: 'convert:boolean',
        displayName: 'Convert records',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
      });

      // Update records
      Survey.Serializer.addProperty('resources', {
        name: 'update:boolean',
        displayName: 'Update records',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
      });

      // Inline edition
      Survey.Serializer.addProperty('resources', {
        name: 'inlineEdition:boolean',
        displayName: 'Inline edition',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
      });

      // Export records
      Survey.Serializer.addProperty('resources', {
        name: 'export:boolean',
        displayName: 'Export records',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
      });

      // Can search
      Survey.Serializer.addProperty('resources', {
        name: 'canSearch:boolean',
        category: 'Custom Questions',
        dependsOn: 'resource',
        default: true,
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
            // return !hasUniqueRecord(obj.resource);
          }
        },
        visibleIndex: 3,
      });

      // Add template
      Survey.Serializer.addProperty('resources', {
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
            getResourceById({ id: obj.resource }).subscribe((response) => {
              const serverRes = response.data.resource.forms || [];
              const res = [];
              res.push({ value: null });
              for (const item of serverRes) {
                res.push({ value: item.id, text: item.name });
              }
              choicesCallback(res);
            });
          }
        },
      });

      // Prefill with current record
      Survey.Serializer.addProperty('resources', {
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

      // === Filter by Questions ===
      // Select question
      Survey.Serializer.addProperty('resources', {
        name: 'selectQuestion:dropdown',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'displayField'],
        required: true,
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource || !obj.displayField) {
            return false;
          } else {
            return true;
          }
        },
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

      // Static value
      Survey.Serializer.addProperty('resources', {
        type: 'string',
        name: 'staticValue',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'selectQuestion', 'displayField'],
        visibleIf: (obj: any) =>
          obj.selectQuestion === '#staticValue' && !!obj.displayField,
        visibleIndex: 3,
      });

      // Filter by
      Survey.Serializer.addProperty('resources', {
        type: 'dropdown',
        name: 'filterBy',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'displayField', 'selectQuestion'],
        visibleIf: (obj: any) => !!obj.selectQuestion && !!obj.displayField,
        choices: (obj: any, choicesCallback: any) => {
          if (obj.resource) {
            getResourceById({ id: obj.resource }).subscribe((response) => {
              const serverRes = response.data.resource.fields;
              const res = [];
              for (const item of serverRes) {
                res.push({ value: item.name });
              }
              choicesCallback(res);
            });
          }
        },
        visibleIndex: 3,
      });

      // Filter condition
      Survey.Serializer.addProperty('resources', {
        type: 'dropdown',
        name: 'filterCondition',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'displayField', 'selectQuestion'],
        visibleIf: (obj: any) =>
          !!obj.resource && !!obj.displayField && !!obj.selectQuestion,
        choices: (obj: any, choicesCallback: any) => {
          const questionByName = !!obj.survey.getQuestionByName(
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

      // Select resource tooltip
      Survey.Serializer.addProperty('resources', {
        category: 'Filter by Questions',
        type: 'description',
        name: 'selectResourceText',
        displayName: 'Select a resource',
        dependsOn: ['resource', 'displayField'],
        visibleIf: (obj: any) => !obj.resource || !obj.displayField,
        visibleIndex: 3,
        onPropertyEditorUpdate: (_: any, propertyEditor: any) => {
          propertyEditor.innerHTML =
            'First you have to select a resource before set filters';
        },
      });

      // Custom filter tooltip
      Survey.Serializer.addProperty('resources', {
        category: 'Filter by Questions',
        type: 'description',
        name: 'customFilterEl',
        displayName: 'Custom Filter',
        dependsOn: ['resource', 'selectQuestion'],
        visibleIf: (obj: any) => obj.resource && !obj.selectQuestion,
        visibleIndex: 3,
        onPropertyEditorUpdate: (_: any, propertyEditor: any) => {
          const tab = '&nbsp;&nbsp;&nbsp;&nbsp;';
          propertyEditor.innerHTML = `You can use curly brackets to get access to the question values.
          <br><br><b>field</b>: select the field to be filter by.
          <br><b>operator</b>: contains, =, !=, >, <, >=, <=
          <br><b>value:</b> {question1} or static value
          <br><b>Example:</b>
          <br>[
          <br>${tab}{
          <br>${tab}${tab}"field": "name",
          <br>${tab}${tab}"operator":"contains",
          <br>${tab}${tab}"value": "Laura"
          <br>${tab}},
          <br>${tab}{
          <br>${tab}${tab}"field":"age",
          <br>${tab}${tab}"operator": ">",
          <br>${tab}${tab}"value": "{question1}"
          <br>${tab}}
          <br>]`;
        },
      });

      // Custom filter
      Survey.Serializer.addProperty('resources', {
        category: 'Filter by Questions',
        type: 'text',
        name: 'customFilter',
        displayName: ' ',
        dependsOn: ['resource', 'selectQuestion'],
        visibleIf: (obj: any) => obj.resource && !obj.selectQuestion,
        visibleIndex: 4,
      });

      Survey.Serializer.addProperty('resources', {
        name: 'newCreatedRecords',
        category: 'Custom Questions',
        visible: false,
      });

      Survey.Serializer.addProperty('resources', {
        name: 'afterRecordCreation',
        // type: 'expression',
        category: 'logic',
      });

      Survey.Serializer.addProperty('resources', {
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
      // support the placeholder field
      if (question.placeholder) {
        const locPlaceholder = question.getLocalizableStringText('placeholder');
        question.contentQuestion.placeholder =
          locPlaceholder || question.placeholder;
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
          if (question.selectQuestion) {
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
          }
        }
        getResourceById({ id: question.resource }).subscribe((response) => {
          const serverRes =
            response.data.resource.records?.edges?.map((x) => x.node) || [];
          const res = [];
          for (const item of serverRes) {
            res.push({
              value: item?.id,
              text: item?.data[question.displayField],
            });
          }
          question.contentQuestion.choices = res;
          if (!question.placeholder || question.placeholder === 'Select...') {
            question.contentQuestion.placeholder =
              'Select a record from ' + response.data.resource.name + '...';
          }
          if (!question.filterBy || question.filterBy.length < 1) {
            this.populateChoices(question);
          }
        });
        if (question.selectQuestion) {
          if (question.selectQuestion === '#staticValue') {
            setAdvanceFilter(question.staticValue, question);
            this.populateChoices(question);
          } else {
            question.survey.onValueChanged.add((_: any, options: any) => {
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
                question.survey.onValueChanged.add((_: any, options: any) => {
                  if (options.question.name === quest) {
                    if (!!options.value) {
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
          const f = field ? field : question.filteryBy;
          const obj = filters.filter((i: any) => i.field === f);
          if (obj.length > 0) {
            resourcesFilterValues.next(obj);
          }
        } else if (question.customFilter) {
          resourcesFilterValues.next(filters);
        }
      } else {
        getResourceById({ id: question.resource, filters }).subscribe(
          (response) => {
            const serverRes =
              response.data.resource.records?.edges?.map((x) => x.node) || [];
            const res: any[] = [];
            for (const item of serverRes) {
              res.push({
                value: item?.id,
                text: item?.data[question.displayField],
              });
            }
            question.contentQuestion.choices = res;
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
        question.gridFieldsSettings = new FormGroup({}).getRawValue();
        filters = [];
        this.resourceFieldsName = [];
        question.addRecord = false;
        question.addTemplate = null;
        question.prefillWithCurrentRecord = false;
      }
    },
    onAfterRender: (question: any, el: HTMLElement): void => {
      // hide tagbox if grid view is enable
      if (question.displayAsGrid) {
        const element = el.getElementsByTagName('sv-ng-tagbox-question')[0]
          .parentElement;
        if (element) element.style.display = 'none';
      }
      // Display the add button | grid for resources question
      if (question.resource) {
        const parentElement = el.querySelector('.safe-qst-content');
        if (parentElement) {
          buildRecordsGrid(question, parentElement.firstChild);

          if (question.survey.mode !== 'display' && el.parentElement) {
            el.parentElement.querySelector('#actionsButtons')?.remove();
            const actionsButtons = document.createElement('div');
            actionsButtons.id = 'actionsButtons';
            actionsButtons.style.display = 'flex';
            actionsButtons.style.marginBottom = '0.5em';

            const searchBtn = buildSearchButton(
              question,
              question.gridFieldsSettings,
              true,
              dialog
            );
            actionsButtons.appendChild(searchBtn);

            const addBtn = buildAddButton(question, true, dialog);
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
                question.addRecord && question.addTemplate ? '' : 'none';
            });
          }
        }
      }
    },
  };
  Survey.ComponentCollection.Instance.add(component);

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
   * @returns The SafeCoreGridComponent, or null if the displayAsGrid property
   * of the question object is false
   */
  const buildRecordsGrid = (question: any, el: any): any => {
    let instance: SafeCoreGridComponent;
    if (question.displayAsGrid) {
      const grid = domService.appendComponentToBody(
        SafeCoreGridComponent,
        el.parentElement
      );
      instance = grid.instance;
      setGridInputs(instance, question);
      question.survey.onValueChanged.add((_: any, options: any) => {
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
  const setGridInputs = (
    instance: SafeCoreGridComponent,
    question: any
  ): void => {
    instance.multiSelect = true;
    const query = question.gridFieldsSettings || {};
    const settings = {
      query: {
        ...query,
        filter: {
          logic: 'and',
          filters: [
            {
              field: 'ids',
              operator: 'eq',
              value: question.value || [],
            },
          ],
        },
      },
    };
    if (!question.readOnlyGrid) {
      Object.assign(settings, {
        actions: {
          export: question.export,
          delete: question.canDelete,
          history: question.history,
          convert: question.convert,
          update: question.update,
          inlineEdition: question.inlineEdition,
        },
      });
    }
    instance.settings = settings;
    instance.configureGrid();
  };
};
