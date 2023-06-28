import { Apollo } from 'apollo-angular';
import {
  GET_SHORT_RESOURCE_BY_ID,
  GET_RESOURCE_BY_ID,
  GetResourceByIdQueryResponse,
} from '../graphql/queries';
import * as SurveyCreator from 'survey-creator';
import { resourceConditions } from './resources';
import { Dialog } from '@angular/cdk/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SafeResourceDropdownComponent } from '../../components/resource-dropdown/resource-dropdown.component';
import { DomService } from '../../services/dom/dom.service';
import { buildSearchButton, buildAddButton } from './utils';
import get from 'lodash/get';
import { Question, QuestionResource } from '../types';
import { JsonMetadata, SurveyModel } from 'survey-angular';

/**
 * Inits the resource question component of for survey.
 *
 * @param Survey Survey library
 * @param domService Shared DOM service
 * @param apollo Apollo client
 * @param dialog Dialog
 * @param formBuilder Angular form service
 */
export const init = (
  Survey: any,
  domService: DomService,
  apollo: Apollo,
  dialog: Dialog,
  formBuilder: UntypedFormBuilder
): void => {
  const getResourceById = (data: { id: string }) =>
    apollo.query<GetResourceByIdQueryResponse>({
      query: GET_SHORT_RESOURCE_BY_ID,
      variables: {
        id: data.id,
      },
    });

  const getResourceRecordsById = (data: {
    id: string;
    filters?: { field: string; operator: string; value: string }[];
  }) =>
    apollo.query<GetResourceByIdQueryResponse>({
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
  Survey.SvgRegistry.registerIconFromSvg(
    'resource',
    '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>'
  );

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
      const serializer: JsonMetadata = Survey.Serializer;
      serializer.addProperty('resource', {
        name: 'resource',
        category: 'Custom Questions',
        type: 'resourceDropdown',
        visibleIndex: 3,
        required: true,
      });

      const resourceEditor = {
        render: (editor: any, htmlElement: HTMLElement) => {
          const question = editor.object;
          const dropdown = domService.appendComponentToBody(
            SafeResourceDropdownComponent,
            htmlElement
          );
          const instance: SafeResourceDropdownComponent = dropdown.instance;
          instance.resource = question.resource;
          instance.choice.subscribe((res) => editor.onChanged(res));
        },
      };

      SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor(
        'resourceDropdown',
        resourceEditor
      );

      serializer.addProperty('resource', {
        name: 'displayField',
        category: 'Custom Questions',
        dependsOn: 'resource',
        required: true,
        visibleIf: (obj: null | QuestionResource) => !!obj && !!obj.resource,
        visibleIndex: 3,
        choices: (obj: QuestionResource, choicesCallback: any) => {
          if (obj.resource) {
            getResourceById({ id: obj.resource }).subscribe(({ data }) => {
              const serverRes = data.resource.fields;
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

      serializer.addProperty('resource', {
        name: 'relatedName',
        category: 'Custom Questions',
        dependsOn: 'resource',
        required: true,
        description: 'unique name for this resource question',
        visibleIf: (obj: null | QuestionResource) => !!obj && !!obj.resource,
        visibleIndex: 4,
      });

      // Build set available grid fields button
      serializer.addProperty('resource', {
        name: 'Search resource table',
        type: 'resourceFields',
        isRequired: true,
        category: 'Custom Questions',
        dependsOn: ['resource'],
        visibleIf: (obj: null | QuestionResource) => !!obj && !!obj.resource,
        visibleIndex: 5,
      });

      const availableFieldsEditor = {
        render: (editor: any, htmlElement: HTMLElement) => {
          const btn = document.createElement('button');
          btn.innerText = 'Available grid fields';
          btn.style.width = '100%';
          btn.style.border = 'none';
          btn.style.padding = '10px';
          htmlElement.appendChild(btn);
          btn.onclick = () => {
            const currentQuestion = editor.object;
            getResourceById({ id: currentQuestion.resource }).subscribe(
              async ({ data }) => {
                if (data.resource && data.resource.name) {
                  const nameTrimmed = data.resource.name
                    .replace(/\s/g, '')
                    .toLowerCase();
                  const { ConfigDisplayGridFieldsModalComponent } =
                    await import(
                      '../../components/config-display-grid-fields-modal/config-display-grid-fields-modal.component'
                    );
                  const dialogRef = dialog.open(
                    ConfigDisplayGridFieldsModalComponent,
                    {
                      data: {
                        form: !currentQuestion.gridFieldsSettings
                          ? null
                          : this.convertFromRawToFormGroup(
                              currentQuestion.gridFieldsSettings
                            ),
                        resourceName: nameTrimmed,
                      },
                    }
                  );
                  dialogRef.closed.subscribe((res: any) => {
                    if (res && res.value.fields) {
                      currentQuestion.gridFieldsSettings = res.getRawValue();
                    }
                  });
                }
              }
            );
          };
        },
      };

      SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor(
        'resourceFields',
        availableFieldsEditor
      );

      serializer.addProperty('resource', {
        name: 'test service',
        category: 'Custom Questions',
        dependsOn: ['resource', 'displayField'],
        required: true,
        visibleIf: (obj: null | QuestionResource) =>
          !!obj && !!obj.resource && !!obj.displayField,
        visibleIndex: 3,
        choices: (obj: QuestionResource, choicesCallback: any) => {
          if (obj.resource) {
            getResourceRecordsById({ id: obj.resource }).subscribe(
              ({ data }) => {
                const serverRes =
                  data.resource.records?.edges?.map((x) => x.node) || [];
                const res = [];
                res.push({ value: null });
                for (const item of serverRes) {
                  res.push({
                    value: item?.id,
                    text: item?.data[obj.displayField || 'id'],
                  });
                }
                choicesCallback(res);
              }
            );
          }
        },
      });
      serializer.addProperty('resource', {
        name: 'addRecord:boolean',
        category: 'Custom Questions',
        dependsOn: ['resource'],
        visibleIf: (obj: null | QuestionResource) => !!obj && !!obj.resource,
        visibleIndex: 2,
      });
      serializer.addProperty('resource', {
        name: 'canSearch:boolean',
        category: 'Custom Questions',
        dependsOn: ['resource'],
        default: true,
        visibleIf: (obj: null | QuestionResource) => !!obj && !!obj.resource,
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
            getResourceById({ id: obj.resource }).subscribe(({ data }) => {
              const serverRes = data.resource.forms || [];
              const res: any[] = [];
              res.push({ value: null });
              for (const item of serverRes) {
                res.push({ value: item.id, text: item.name });
              }
              choicesCallback(res);
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
        visibleIf: (obj: null | QuestionResource) =>
          !!obj && !!obj.resource && !!obj.displayField,
        visibleIndex: 3,
        choices: (obj: QuestionResource, choicesCallback: any) => {
          if (obj && obj.resource) {
            const questions: any[] = [
              '',
              { value: '#staticValue', text: 'Set from static value' },
            ];
            (obj.survey as SurveyModel)
              .getAllQuestions()
              .forEach((question: Question) => {
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
              const serverRes = data.resource.fields;
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
        type: 'selectResourceText',
        name: 'selectResourceText',
        displayName: 'Select a resource',
        dependsOn: ['resource', 'displayField'],
        visibleIf: (obj: null | QuestionResource) =>
          obj && (!obj.resource || !obj.displayField),
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

      const selectResourceText = {
        render: (editor: any, htmlElement: HTMLElement): void => {
          const text = document.createElement('div');
          text.innerHTML =
            'First you have to select a resource before set filters';
          htmlElement.appendChild(text);
        },
      };
      SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor(
        'selectResourceText',
        selectResourceText
      );

      serializer.addProperty('resource', {
        category: 'Filter by Questions',
        type: 'customFilter',
        name: 'customFilterEl',
        displayName: 'Custom Filter',
        dependsOn: ['resource', 'selectQuestion'],
        visibleIf: (obj: null | QuestionResource) =>
          obj && obj.resource && !obj.selectQuestion,
        visibleIndex: 3,
      });

      const customFilterElements = {
        render: (editor: any, htmlElement: HTMLElement): void => {
          const text = document.createElement('div');
          text.innerHTML =
            'You can use curly brackets to get access to the question values.' +
            '<br><b>field</b>: select the field to be filter by.' +
            '<br><b>operator</b>: contains, =, !=, >, <, >=, <=' +
            '<br><b>value:</b> {question1} or static value' +
            '<br><b>Example:</b>' +
            '<br>[{' +
            '<br>"field": "name",' +
            '<br>"operator":"contains",' +
            '<br>"value": "Laura"' +
            '<br>},' +
            '<br>{' +
            '<br>"field":"age",' +
            '<br>"operator": ">",' +
            '<br>"value": "{question1}"' +
            '<br>}]';
          htmlElement.appendChild(text);
        },
      };

      SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor(
        'customFilter',
        customFilterElements
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

      Survey.Serializer.addProperty('resource', {
        name: 'newCreatedRecords',
        category: 'Custom Questions',
        visible: false,
      });

      Survey.Serializer.addProperty('resource', {
        name: 'afterRecordCreation',
        // type: 'expression',
        category: 'logic',
      });

      Survey.Serializer.addProperty('resource', {
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
          if (question.selectQuestion) {
            question.registerFunctionOnPropertyValueChanged(
              'filterCondition',
              () => {
                filters.map((i: any) => {
                  i.operator = question.filterCondition;
                });
              }
            );
          }
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
            const serverRes =
              data.resource.records?.edges?.map((x) => x.node) || [];
            const res: any[] = [];
            for (const item of serverRes) {
              res.push({
                value: item?.id,
                text: item?.data[question.displayField || 'id'],
              });
            }
            question.contentQuestion.choices = res;
            if (!question.placeholder) {
              question.contentQuestion.optionsCaption =
                'Select a record from ' + data.resource.name + '...';
            }
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
          dialog
        );
        actionsButtons.appendChild(searchBtn);

        const addBtn = buildAddButton(question, false, dialog);
        actionsButtons.appendChild(addBtn);

        const parentElement = el.querySelector('.safe-qst-content');
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
      }
    },
    convertFromRawToFormGroup: (
      gridSettingsRaw: any
    ): UntypedFormGroup | null => {
      if (!gridSettingsRaw.fields) {
        return null;
      }
      const auxForm = formBuilder.group(gridSettingsRaw);
      auxForm.controls.fields.setValue(gridSettingsRaw.fields);
      return auxForm;
    },
  };
  Survey.ComponentCollection.Instance.add(component);

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
