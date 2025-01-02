import { DomService } from '../../services/dom/dom.service';
import { EmbeddedViewRef } from '@angular/core';
import { Question, QuestionText } from '../types';
import { ButtonComponent } from '@oort-front/ui';
import { IconComponent } from '@oort-front/ui';
import {
  CustomWidgetCollection,
  JsonMetadata,
  Serializer,
  SurveyModel,
} from 'survey-core';
import { CustomPropertyGridComponentTypes } from '../components/utils/components.enum';
import { registerCustomPropertyEditor } from '../components/utils/component-register';
import {
  DateInputFormat,
  createPickerInstance,
  getDateDisplay,
  setDateValue,
} from '../components/utils/create-picker-instance';
import { TranslateService } from '@ngx-translate/core';
import { FieldSearchTableComponent } from '../components/field-search-table/field-search-table.component';
import { isNaN } from 'lodash';

/**
 * Custom definition for overriding the text question. Allowed support for dates.
 *
 * @param domService Shared DOM service
 * @param translateService Angular translate service
 * @param customWidgetCollectionInstance CustomWidgetCollection * @param document Document
 * @param document Document
 */
export const init = (
  domService: DomService,
  translateService: TranslateService,
  customWidgetCollectionInstance: CustomWidgetCollection,
  document: Document
): void => {
  const widget = {
    name: 'text-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: Question): boolean => question.getType() === 'text',
    init: (): void => {
      const serializer: JsonMetadata = Serializer;
      // add que isUnique property to the text question
      serializer.addProperty('text', {
        name: 'unique:boolean',
        category: 'general',
        default: false,
        visibleIndex: 7,
      });
      // hide the min and max property for date, datetime and time types
      serializer.getProperty('text', 'min').visibleIf = (obj: QuestionText) =>
        ['number', 'month', 'week'].includes(obj.inputType || '');
      serializer.getProperty('text', 'max').visibleIf = (obj: QuestionText) =>
        ['number', 'month', 'week'].includes(obj.inputType || '');
      // create new min and max properties for date, datetime and time types
      serializer.addProperty('text', {
        name: 'dateMin',
        type: CustomPropertyGridComponentTypes.dateTypeDisplayer,
        category: 'general',
        visibleIndex: 8,
        dependsOn: 'inputType',
        visibleIf: (obj: QuestionText) =>
          ['date', 'datetime', 'datetime-local', 'time'].includes(
            obj.inputType || ''
          ),
        onPropertyEditorUpdate: (obj: QuestionText, propertyEditor: any) => {
          if (!!obj && !!obj.inputType) {
            propertyEditor.inputType = obj.inputType;
          }
        },
        onSetValue: (obj: QuestionText, value: any) => {
          obj.setPropertyValue('dateMin', value);
          obj.setPropertyValue('min', value);
        },
      });
      serializer.addProperty('text', {
        name: 'dateMax',
        type: CustomPropertyGridComponentTypes.dateTypeDisplayer,
        category: 'general',
        visibleIndex: 9,
        dependsOn: 'inputType',
        visibleIf: (obj: QuestionText) =>
          ['date', 'datetime', 'datetime-local', 'time'].includes(
            obj.inputType || ''
          ),
        onPropertyEditorUpdate: (obj: QuestionText, propertyEditor: any) => {
          if (!!obj && !!obj.inputType) {
            propertyEditor.inputType = obj.inputType;
          }
        },
        onSetValue: (obj: QuestionText, value: any) => {
          obj.setPropertyValue('dateMax', value);
          obj.setPropertyValue('max', value);
        },
      });
      // @TODO: Only allow for input type "text"
      serializer.addProperty('text', {
        name: 'searchSimilarRecords:boolean',
        category: 'general',
        visibleIf: (obj: QuestionText) => obj.inputType === 'text',
      });
      serializer.addProperty('text', {
        name: 'searchTableTitle:string',
        category: 'general',
        visibleIf: (obj: QuestionText) => obj.searchSimilarRecords,
      });
      serializer.addProperty('text', {
        name: 'searchTableEmpty:string',
        category: 'general',
        visibleIf: (obj: QuestionText) => obj.searchSimilarRecords,
      });
      serializer.addProperty('text', {
        name: 'searchTableOpenRecord:string',
        category: 'general',
        visibleIf: (obj: QuestionText) => obj.searchSimilarRecords,
      });
      // register the editor for type "date" with kendo date picker
      registerCustomPropertyEditor(
        CustomPropertyGridComponentTypes.dateTypeDisplayer
      );
    },
    isDefaultRender: true,
    afterRender: (question: QuestionText, el: HTMLInputElement): void => {
      let pickerDiv: HTMLDivElement | null = null;
      // add kendo date pickers for text inputs with dates types
      const updateTextInput = () => {
        el.parentElement?.querySelector('.k-input')?.parentElement?.remove(); // .k-input class is shared by the 3 types of picker
        // Remove the picker div whenever we switch question type, so it is not duplicated
        if (pickerDiv) {
          pickerDiv.remove();
        }
        if (
          ['datetime', 'datetime-local', 'time'].includes(question.inputType)
        ) {
          pickerDiv = document.createElement('div');
          pickerDiv.classList.add('flex', 'min-h-[36px]');
          const pickerInstance = createPickerInstance(
            question.inputType as DateInputFormat,
            pickerDiv,
            domService,
            translateService
          );

          if (pickerInstance) {
            // create button that clears the date picker
            const button = document.createElement('button');
            button.classList.add(
              '!grid',
              '!place-items-center',
              '!bg-transparent',
              '!border-none',
              '!outline-none',
              '!hidden',
              '!min-w-0',
              '!px-2',
              'top-0',
              'bottom-0'
            );

            // disable the button if the question is read only
            if (question.isReadOnly) {
              button.disabled = true;
              button.style.cursor = 'default';
              button.classList.add('opacity-50');
            }

            const icon = domService.appendComponentToBody(
              IconComponent,
              button
            );

            // add the button to the DOM
            pickerDiv.appendChild(button);

            const iconInstance: IconComponent = icon.instance;
            iconInstance.icon = 'close';
            iconInstance.variant = 'grey';

            pickerInstance.onBlur.subscribe(() => {
              const value = pickerInstance.value;
              if (value) {
                question.value = setDateValue(value, question.inputType);
                // show the clear button
                button.classList.remove('!hidden');
              } else {
                question.value = null;
              }
            });

            // On change, we update the value of the select
            question.valueChangedCallback = () => {
              if (question.value !== pickerInstance.value?.toISOString()) {
                try {
                  pickerInstance.writeValue(
                    (question.value ? new Date(question.value) : null) as any
                  );
                } catch {
                  // There's no other way of programmatically clearing the date picker
                  // besides setting the value to null, which throws an error
                }
              }
            };

            if (question.value) {
              // Init the question with the date in the correct format
              pickerInstance.writeValue(
                getDateDisplay(question.value, question.inputType)
              );
              //The register on change event only triggers from the calendar UI selection, therefor we have to manually show the clear button in first load
              // https://www.telerik.com/kendo-angular-ui/components/dateinputs/api/DatePickerComponent/#toc-valuechange
              button.classList.remove('hidden');
            }
            if (question.min) {
              pickerInstance.min = getDateDisplay(
                question.min,
                question.inputType
              );
            }
            if (question.max) {
              pickerInstance.max = getDateDisplay(
                question.max,
                question.inputType
              );
            }
            pickerInstance.readonly = question.isReadOnly;
            pickerInstance.disabled = question.isReadOnly;

            el.style.display = 'none';
            pickerDiv.classList.add('flex', 'flex-row');
            el.parentElement?.appendChild(pickerDiv);

            button.onclick = () => {
              question.value = null;
              button.classList.add('!hidden');
              pickerInstance?.writeValue(null as any);
            };

            // Positioning the button inside the picker
            el.parentElement?.classList.add('relative');
            button.classList.add('absolute', 'right-7', 'z-10');
            (question.survey as SurveyModel).onValueChanged.add(
              (_: any, options: any) => {
                if (options.question.name === question.name) {
                  if (options.question.value) {
                    pickerInstance.writeValue(
                      getDateDisplay(question.value, question.inputType)
                    );
                  } else {
                    pickerInstance.writeValue(null as any);
                  }
                }
              }
            );
            question.registerFunctionOnPropertyValueChanged(
              'readOnly',
              (value: boolean) => {
                pickerInstance.readonly = value;
                pickerInstance.disabled = value;
              }
            );
          }
        } else if (question.inputType === 'date') {
          if (
            typeof question.value === 'string' &&
            !isNaN(new Date(question.value).getTime())
          ) {
            question.value = question.value?.split('T')[0];
          } else if (question.value instanceof Date) {
            const date = question.value;
            const padded = (num: number) => num.toString().padStart(2, '0');
            const dateStr = `${date.getFullYear()}-${padded(
              date.getMonth() + 1
            )}-${padded(date.getDate())}`;
            question.value = dateStr;
          }
        } else {
          el.classList.add('flex-1', 'min-h-[36px]');
          el.style.display = 'initial';
        }
      };
      question.registerFunctionOnPropertyValueChanged(
        'inputType',
        updateTextInput,
        el.id // a unique key to distinguish fields
      );
      // Init
      updateTextInput();

      // Adding an open url icon for urls inputs
      if (question.inputType === 'url') {
        const parentElement = el.parentElement;
        if (parentElement) {
          // Generate the dynamic component with its parameters
          const button = domService.appendComponentToBody(
            ButtonComponent,
            parentElement
          );
          const instance: ButtonComponent = button.instance;
          instance.isIcon = true;
          instance.icon = 'open_in_new';
          instance.size = 'small';
          instance.category = 'tertiary';
          // we override the css of the component
          const domElem = (button.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;
          (domElem.firstChild as HTMLElement).style.minWidth = 'unset';

          // Set the default styling of the parent
          parentElement.style.display = 'flex';
          parentElement.style.alignItems = 'center';
          parentElement.style.flexDirection = 'row';
          parentElement.style.pointerEvents = 'auto';
          parentElement.style.justifyContent = 'space-between';
          parentElement.title =
            'The URL should start with "http://" or "https://"';

          // Create an <a> HTMLElement only used to verify the validity of the URL
          const urlTester = document.createElement('a');
          if (
            question.value &&
            !(
              question.value.startsWith('https://') ||
              question.value.startsWith('http://')
            )
          ) {
            urlTester.href = 'https://' + question.value;
          } else {
            urlTester.href = question.value || '';
          }
          instance.disabled =
            !urlTester.host || urlTester.host === window.location.host;

          (question.survey as SurveyModel).onValueChanged.add(
            (__: any, opt: any) => {
              if (opt.question?.name === question.name) {
                if (
                  opt.question.value &&
                  !(
                    opt.question.value.startsWith('https://') ||
                    opt.question.value.startsWith('http://')
                  )
                ) {
                  urlTester.href = 'https://' + opt.question.value;
                } else {
                  urlTester.href = opt.question.value || '';
                }
                instance.disabled =
                  !urlTester.host || urlTester.host === window.location.host;
              }
            }
          );

          button.instance.emittedEventSubject.subscribe((eventType: string) => {
            if (
              eventType === 'click' &&
              urlTester.host &&
              urlTester.host !== window.location.host
            ) {
              window.open(urlTester.href, '_blank', 'noopener,noreferrer');
            }
          });
        }
      }

      if (question.inputType === 'range') {
        const parentElement = el.parentElement;
        if (parentElement) {
          const valueIndicator = document.createElement('span');
          valueIndicator.textContent = question.value;
          valueIndicator.classList.add('font-black', 'text-center', 'text-xl');
          parentElement.appendChild(valueIndicator);

          const inputElement = el.querySelector('input');
          if (inputElement) {
            const createMinMaxSpan = (end: 'min' | 'max') => {
              const DEFAULT_VALUE = end === 'min' ? '0' : '100';
              const span = document.createElement('span');
              span.classList.add('text-gray-500');

              const updateValue = () => {
                span.textContent =
                  question[end + 'ValueExpression'] ||
                  question[end] ||
                  DEFAULT_VALUE;
              };

              updateValue();
              question.registerFunctionOnPropertyValueChanged(
                end,
                updateValue,
                el.id
              );

              return span;
            };

            const minSpan = createMinMaxSpan('min');
            const maxSpan = createMinMaxSpan('max');

            parentElement.appendChild(minSpan);
            parentElement.appendChild(inputElement);
            parentElement.appendChild(maxSpan);

            el.style.display = 'none';

            parentElement.style.display = 'grid';
            parentElement.style.gridTemplateColumns =
              'max-content 1fr max-content';
            parentElement.style.gap = '1rem';
            parentElement.style.alignItems = 'center';

            valueIndicator.style.gridColumn = '1 / span 3';
            minSpan.style.gridColumn = '1';
            inputElement.style.gridColumn = '2';
            maxSpan.style.gridColumn = '3';
          }

          question.registerFunctionOnPropertyValueChanged(
            'value',
            () => {
              valueIndicator.textContent = question.value;
            },
            el.id
          );
        }
      }

      // Adding search table below the input
      if (question.searchSimilarRecords && question.inputType === 'text') {
        const table = domService.appendComponentToBody(
          FieldSearchTableComponent,
          el.parentElement
        );

        const tableInstance = table.instance;
        tableInstance.question = question;
      }
    },
  };

  customWidgetCollectionInstance.addCustomWidget(widget, 'customwidget');
};
