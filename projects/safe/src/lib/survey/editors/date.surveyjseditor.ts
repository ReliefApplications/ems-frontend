import * as SurveyCore from 'survey-core';
import { Question } from 'survey-core';
import { PropertyGridEditorCollection } from 'survey-creator-core';
import { DomService } from '../../services/dom/dom.service';
import {
  DatePickerComponent,
  DateTimePickerComponent,
  TimePickerComponent,
} from '@progress/kendo-angular-dateinputs';

type DateInputFormat = 'date' | 'datetime' | 'datetime-local' | 'time';

export const init = (domService: DomService): void => {
  const widget = {
    name: 'date-editor',
    title: 'DateEditor',
    isFit: (question: Question) => question.getType() === 'dateEditor',
    afterRender: (question: Question, htmlElement: HTMLElement): void => {
      const pickerInstance = createPickerInstance(
        question.inputType as DateInputFormat,
        htmlElement
      );
      // if (pickerInstance) {
      //   if (question[editor.property.name as keyof Question]) {
      //     pickerInstance.value = getDateDisplay(
      //       question[editor.property.name as keyof Question],
      //       question.inputType
      //     );
      //   }
      //   pickerInstance.registerOnChange((value: Date | null) => {
      //     if (value) {
      //       editor.onChanged(setDateValue(value, question.inputType));
      //     } else {
      //       editor.onChanged(null);
      //     }
      //   });
      // }
    },
  };

  /**
   * Set date for question / parameter value
   *
   * @param value input value
   * @param inputType question input type
   * @returns formatted date
   */
  const setDateValue = (value: Date, inputType: string): Date | string => {
    if (inputType === 'time') {
      // for time fields, translate the date to UTC
      return new Date(
        Date.UTC(1970, 0, 1, value.getHours(), value.getMinutes())
      );
    } else {
      return value.toISOString();
    }
  };

  /**
   * It creates a date, datetime or time picker instance based on the input type
   *
   * @param inputType - The type of the input element.
   * @param element - The element that the directive is attached to.
   * @returns The picker instance, or null if the type is not allowed
   */
  const createPickerInstance = (
    inputType: DateInputFormat,
    element: any
  ):
    | DatePickerComponent
    | DateTimePickerComponent
    | TimePickerComponent
    | null => {
    switch (inputType) {
      case 'date':
        const datePicker = domService.appendComponentToBody(
          DatePickerComponent,
          element
        );
        const datePickerInstance: DatePickerComponent = datePicker.instance;
        datePickerInstance.format = 'dd/MM/yyyy';
        return datePickerInstance;
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
      default:
        return null;
    }
  };

  SurveyCore.CustomWidgetCollection.Instance.addCustomWidget(
    widget,
    'customwidget'
  );
  const dateEditor =
    SurveyCore.CustomWidgetCollection.Instance.getCustomWidgetByName(
      'date-editor'
    );
  console.log(SurveyCore.CustomWidgetCollection.Instance.widgets);
  dateEditor.showInToolbox = false;
  PropertyGridEditorCollection.register({
    fit: (prop) =>
      ['date', 'datetime', 'datetime-local', 'time'].includes(
        prop.inputType || ''
      ),
    getJSON: () => ({
      type: 'dateEditor',
    }),
  });
};
