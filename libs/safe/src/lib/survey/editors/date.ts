import {
  DatePickerComponent,
  DateTimePickerComponent,
  TimePickerComponent,
} from '@progress/kendo-angular-dateinputs';
import { DomService } from '../../services/dom/dom.service';
import { QuestionText } from 'survey-knockout';
import * as SurveyCreator from 'survey-creator';

export type DateInputFormat = 'date' | 'datetime' | 'datetime-local' | 'time';

/**
 * Loads a date editor to be used in surveys
 *
 * @param domService Dom service to create elements with
 */
export const loadDateEditor = (domService: DomService) => {
  const editor = {
    render: (editor: any, htmlElement: HTMLElement) => {
      const question = editor.object as QuestionText;
      let pickerDiv: HTMLDivElement | null = null;
      const updatePickerInstance = () => {
        if (pickerDiv) {
          pickerDiv.remove();
        }
        htmlElement.querySelector('.k-widget')?.remove(); // .k-widget class is shared by the 3 types of picker
        pickerDiv = document.createElement('div');
        const pickerInstance = createPickerInstance(
          question.inputType as DateInputFormat,
          pickerDiv,
          domService
        );
        if (pickerInstance) {
          if (question[editor.property.name as keyof QuestionText]) {
            pickerInstance.value = getDateDisplay(
              question[editor.property.name as keyof QuestionText],
              question.inputType
            );
          }
          pickerInstance.registerOnChange((value: Date | null) => {
            if (value) {
              editor.onChanged(setDateValue(value, question.inputType));
            } else {
              editor.onChanged(null);
            }
          });
        }
        htmlElement.appendChild(pickerDiv);
      };
      question.registerFunctionOnPropertyValueChanged(
        'inputType',
        updatePickerInstance,
        // eslint-disable-next-line no-underscore-dangle
        editor.property_.name // a unique key to distinguish multiple date properties
      );
      // Init
      updatePickerInstance();
    },
  };

  SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor(
    'date',
    editor
  );
};

/**
 * It creates a date, datetime or time picker instance based on the input type
 *
 * @param inputType - The type of the input element.
 * @param element - The element that the directive is attached to.
 * @param domService Shared DOM service
 * @returns The picker instance, or null if the type is not allowed
 */
export const createPickerInstance = (
  inputType: DateInputFormat,
  element: any,
  domService: DomService
):
  | DatePickerComponent
  | DateTimePickerComponent
  | TimePickerComponent
  | null => {
  switch (inputType) {
    case 'datetime':
    case 'datetime-local':
      const dateTimePicker = domService.appendComponentToBody(
        DateTimePickerComponent,
        element
      );
      const dateTimePickerInstance: DateTimePickerComponent =
        dateTimePicker.instance;
      dateTimePickerInstance.format = 'dd/MM/yyyy HH:mm';
      return dateTimePickerInstance;
    case 'time':
      const timePicker = domService.appendComponentToBody(
        TimePickerComponent,
        element
      );
      const timePickerInstance: TimePickerComponent = timePicker.instance;
      timePickerInstance.format = 'HH:mm';
      return timePickerInstance;
    case 'date':
    default:
      const datePicker = domService.appendComponentToBody(
        DatePickerComponent,
        element
      );
      const datePickerInstance: DatePickerComponent = datePicker.instance;
      datePickerInstance.format = 'dd/MM/yyyy';
      return datePickerInstance;
  }
};

/**
 * Get date for input display.
 *
 * @param value question value
 * @param inputType question input type
 * @returns formatted date
 */
export const getDateDisplay = (value: any, inputType: string): Date => {
  const date = new Date(value);
  if (inputType === 'time') {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  } else {
    return date;
  }
};

/**
 * Set date for question / parameter value
 *
 * @param value input value
 * @param inputType question input type
 * @returns formatted date
 */
export const setDateValue = (value: Date, inputType: string): Date | string => {
  if (inputType === 'time') {
    // for time fields, translate the date to UTC
    return new Date(Date.UTC(1970, 0, 1, value.getHours(), value.getMinutes()));
  } else {
    return value.toISOString();
  }
};
