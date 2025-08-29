import { Dialog } from '@angular/cdk/dialog';
import { ComponentRef, Injector, NgZone } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import { Apollo } from 'apollo-angular';
import { isNil } from 'lodash';
import get from 'lodash/get';
import {
  ComponentCollection,
  JsonObject,
  Serializer,
  SurveyModel,
  SvgRegistry,
} from 'survey-core';
import { CoreGridComponent } from '../../components/ui/core-grid/core-grid.component';
import { ResourceQueryResponse } from '../../models/resource.model';
import { DomService } from '../../services/dom/dom.service';
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import {
  GET_RESOURCE_BY_ID,
  GET_SHORT_RESOURCE_BY_ID,
} from '../graphql/queries';
import { QuestionResource } from '../types';
import {
  buildAddButton,
  buildSearchButton,
  buildAddInlineButton,
  processNewCreatedRecords,
  setUpActionsButtonWrapper,
} from './utils';
import { registerCustomPropertyEditor } from './utils/component-register';
import { CustomPropertyGridComponentTypes } from './utils/components.enum';

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
  const formHelpersService = injector.get(FormHelpersService);

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

  /**
   * Fetch records of resource
   *
   * @param question Current question
   * @returns Resource records query
   */
  const getResourceRecordsById = (question: any) => {
    return apollo.query<ResourceQueryResponse>({
      query: GET_RESOURCE_BY_ID,
      variables: {
        id: question.resource, // id of the resource
        ...(question.filters && {
          filter: question.filters,
        }),
      },
      fetchPolicy: 'no-cache',
    });
  };

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

  // const hasUniqueRecord = ((id: string) => false);
  // resourcesForms.filter(r => (r.id === id && r.coreForm && r.coreForm.uniqueRecord)).length > 0);

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

  const visibleIfResourceAndDisplayGridAndAddRecord = (obj: any) => {
    if (!obj || !obj.resource || !obj.displayAsGrid || !obj.addRecord) {
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
            getResourceById(obj.resource).subscribe(({ data }) => {
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
        visibleIndex: 2,
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
        name: 'addInline:boolean',
        displayName: 'Add records inline',
        category: 'Custom Questions',
        dependsOn: ['resource', 'displayAsGrid', 'addRecord', 'addTemplate'],
        visibleIf: visibleIfResourceAndDisplayGridAndAddRecord,
        visibleIndex: 4,
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

      Serializer.addProperty('resources', {
        category: 'Dynamic filtering',
        type: CustomPropertyGridComponentTypes.jsonEditor,
        name: 'customFilter',
        displayName: ' ',
        dependsOn: ['resource'],
        visibleIf: (obj: any) => obj && !isNil(obj.resource),
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

      Serializer.addProperty('resources', {
        name: 'filters',
        category: 'Custom Questions',
        visible: false,
        isSerializable: false,
      });
    },
    /**
     * Fetch the resources when the question is loaded
     *
     * @param question The current question.
     */
    onLoaded(question: any): void {
      // Set placeholder
      if (question.placeholder) {
        question.contentQuestion.optionsCaption = question.placeholder;
      }
      // If question is valid
      if (question.resource) {
        getResourceById(question.resource).subscribe(({ data }) => {
          // const choices = mapQuestionChoices(data, question);
          // question.contentQuestion.choices = choices;
          if (!question.placeholder) {
            question.contentQuestion.optionsCaption =
              'Select a record from ' + data.resource.name + '...';
          }
        });
        if (question.customFilter && question.customFilter.trim().length > 0) {
          /**
           * Get question filters value
           *
           * @param question Current question
           */
          const getQuestionFilters = (question: any) => {
            const surveyData = question.survey?.data;

            const customFilter = JSON.parse(question.customFilter);
            if (Array.isArray(customFilter)) {
              question.filters = {
                logic: 'and',
                filters: customFilter
                  .map((x) => updateFilter(surveyData, x))
                  .filter((x) => !isNil(x)),
              };
            } else {
              question.filters = updateFilter(surveyData, customFilter);
            }

            // Load question choices
            if (!question.displayAsGrid) {
              this.populateChoices(question);
            }
          };

          // Subscribe to survey value changes
          question.survey?.onValueChanged.add(() => {
            getQuestionFilters(question);
          });

          // Initial load
          getQuestionFilters(question);
        } else {
          // Load question choices
          if (!question.displayAsGrid) {
            this.populateChoices(question);
          }
        }
      }
    },
    /**
     * Populate question choices
     *
     * @param question Current question
     */
    populateChoices: (question: any): void => {
      getResourceRecordsById(question).subscribe(({ data }) => {
        const choices = mapQuestionChoices(data, question);
        question.contentQuestion.choices = choices;
      });
    },
    /**
     * Update question properties when the resource property is changed
     *
     * @param question Current question
     * @param propertyName The name of the property
     */
    onPropertyChanged(question: any, propertyName: string): void {
      if (propertyName === 'resource') {
        question.displayField = null;
        this.resourceFieldsName = [];
        question.addRecord = false;
        question.addTemplate = null;
        question.prefillWithCurrentRecord = false;
      }
    },
    onAfterRender: (question: QuestionResource, el: any): void => {
      const parentElement = el.querySelector('.sd-question__content');
      // Display the add button | grid for resources question
      const actionsButtons = setUpActionsButtonWrapper();
      let gridComponentRef!: ComponentRef<CoreGridComponent>;
      // hide tagbox if grid view is enable
      setTimeout(() => {
        if (question.displayAsGrid) {
          const element = el.parentElement?.querySelector('#tagbox');
          if (element) {
            element.style.display = 'none';
          }
        }
      }, 500);

      const searchBtn = buildSearchButton(
        question,
        question.gridFieldsSettings,
        true,
        dialog,
        temporaryRecordsForm,
        document,
        ngZone
      );
      searchBtn.style.display = 'none';
      if (question.resource) {
        searchBtn.style.display = 'block';
        if (parentElement) {
          if (question.displayAsGrid) {
            gridComponentRef = buildGridDisplay(question, parentElement);
          }

          if ((question.survey as SurveyModel).mode !== 'display') {
            searchBtn.style.display = 'block';
            const addBtn = buildAddButton(
              question,
              true,
              dialog,
              ngZone,
              document
            );
            actionsButtons.appendChild(addBtn);

            // Inline add button (when enabled and grid mode)
            const addInlineBtn = buildAddInlineButton(
              question,
              setGridInputs,
              gridComponentRef,
              dialog,
              ngZone,
              document,
              formHelpersService
            );
            actionsButtons.appendChild(addInlineBtn);

            // actionsButtons.style.display = ((!question.addRecord || !question.addTemplate) && !question.gridFieldsSettings) ? 'none' : '';
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
      actionsButtons.appendChild(searchBtn);
      parentElement.insertBefore(actionsButtons, parentElement.firstChild);
      question.registerFunctionOnPropertyValueChanged('resource', () => {
        if (question.resource && question.canSearch) {
          searchBtn.style.display = 'block';
        }
      });
      question.registerFunctionOnPropertyValueChanged('canSearch', () => {
        if (question.displayAsGrid) {
          setGridInputs(gridComponentRef.instance, question);
        } else {
          searchBtn.style.display = question.canSearch ? 'block' : 'none';
        }
      });
      question.registerFunctionOnPropertyValueChanged(
        'gridFieldsSettings',
        () => {
          if (question.displayAsGrid) {
            // Update grid configuration display
            domService.removeComponentFromBody(gridComponentRef);
            gridComponentRef = buildGridDisplay(question, parentElement);
            searchBtn.style.display = 'none';
          }
        }
      );
      question.registerFunctionOnPropertyValueChanged('displayAsGrid', () => {
        const element = el.parentElement?.querySelector('#tagbox');
        if (question.displayAsGrid) {
          if (element) {
            element.style.display = 'none';
          }
          searchBtn.style.display = 'none';
          gridComponentRef = buildGridDisplay(question, parentElement);
        } else {
          domService.removeComponentFromBody(gridComponentRef);
          if (element) {
            element.style.display = 'block';
          }
          if (question.canSearch) {
            searchBtn.style.display = 'block';
          }
        }
      });
      question.registerFunctionOnPropertiesValueChanged(
        [
          'canDelete',
          'history',
          'convert',
          'update',
          'inlineEdition',
          'export',
        ],
        () => {
          if (question.displayAsGrid) {
            setGridInputs(gridComponentRef.instance, question);
          }
        }
      );
    },
  };
  componentCollectionInstance.add(component);

  /**
   * Build grid component ready to display in the given question
   *
   * @param question Current question data
   * @param parentElement Given element where to display grid component
   * @returns created core grid component reference
   */
  function buildGridDisplay(
    question: QuestionResource,
    parentElement: HTMLElement
  ): ComponentRef<CoreGridComponent> {
    const grid: ComponentRef<CoreGridComponent> =
      buildRecordsGrid(question, parentElement.firstChild) || undefined;
    if (grid.instance) {
      grid.instance.removeRowIds.subscribe((ids) => {
        question.value = question.value.filter(
          (id: string) => !ids.includes(id)
        );
      });
    }
    return grid;
  }

  /**
   * Build the grid with the records
   *
   * @param question The resources question
   * @param el The html element in which we want to build the grid
   * @returns The CoreGridComponent, or null if the displayAsGrid property
   * of the question object is false
   */
  const buildRecordsGrid = (
    question: any,
    el: any
  ): ComponentRef<CoreGridComponent> => {
    const grid = domService.appendComponentToBody(
      CoreGridComponent,
      el.parentElement
    );
    setGridInputs(grid.instance, question);
    question.survey?.onValueChanged.add((_: any, options: any) => {
      if (options.name === question.name) {
        setGridInputs(grid.instance, question);
      }
    });
    return grid;
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
    if (
      !question.readOnly &&
      (question.survey as SurveyModel).mode !== 'display'
    ) {
      Object.assign(settings, {
        actions: {
          search: question.canSearch,
          add: question.addRecord,
          export: question.export,
          delete: question.canDelete,
          history: question.history,
          convert: question.convert,
          update: question.update,
          inlineEdition: question.inlineEdition,
          addInline: question.addInline,
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
