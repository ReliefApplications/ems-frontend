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

/**
 * Custom definition for overriding the text question. Allowed support for dates.
 *
 * @param domService Shared DOM service
 * @param customWidgetCollectionInstance CustomWidgetCollection * @param document Document
 * @param document Document
 */
export const init = (
  domService: DomService,
  customWidgetCollectionInstance: CustomWidgetCollection,
  document: Document
): void => {
  const widget = {
    name: 'text-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: Question): boolean => question.getType() === 'text',
    init: (): void => {
      const serializer: JsonMetadata = Serializer;
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
        el.parentElement?.querySelector('.k-widget')?.remove(); // .k-widget class is shared by the 3 types of picker
        // Remove the picker div whenever we switch question type, so it is not duplicated
        if (pickerDiv) {
          pickerDiv.remove();
        }
        if (
          ['date', 'datetime', 'datetime-local', 'time'].includes(
            question.inputType
          )
        ) {
          pickerDiv = document.createElement('div');
          pickerDiv.classList.add('flex', 'min-h-[36px]');
          const pickerInstance = createPickerInstance(
            question.inputType as DateInputFormat,
            pickerDiv,
            domService
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

            const icon = domService.appendComponentToBody(
              IconComponent,
              button
            );

            // add the button to the DOM
            pickerDiv.appendChild(button);

            const iconInstance: IconComponent = icon.instance;
            iconInstance.icon = 'close';
            iconInstance.variant = 'grey';

            pickerInstance.registerOnChange((value: Date | null) => {
              if (value) {
                question.value = setDateValue(value, question.inputType);
                // show the clear button
                button.classList.remove('!hidden');
              } else {
                question.value = null;
              }
            });
            if (question.value) {
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
              (sender: any, options: any) => {
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
              if (opt.question.name === question.name) {
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
    },
  };

  customWidgetCollectionInstance.addCustomWidget(widget, 'customwidget');
};
