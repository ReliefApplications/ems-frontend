import * as SurveyCore from 'survey-core';
import { ComponentRef } from '@angular/core';
import { JsonObjectProperty, Question } from 'survey-core';
import { PropertyGridEditorCollection } from 'survey-creator-core';
import {
  DatePickerComponent,
  DateTimePickerComponent,
  TimePickerComponent,
} from '@progress/kendo-angular-dateinputs';
import { DomService } from '../../services/dom/dom.service';

type DateInputFormat = 'date' | 'datetime' | 'datetime-local' | 'time';

/**
 * Inits the date editor widget
 *
 * @param domService - The dom service
 */
export const init = (domService: DomService): void => {
  const widget = {
    name: 'date-editor',
    title: 'Date Editor',
    isFit: (question: Question) => question.getType() === 'date-editor',
    init: () => {
      // Register date-editor type using the empty question as the base.
      SurveyCore.Serializer.addClass('date-editor', [], undefined, 'empty');

      // Hide the date-editor type from the toolbox.
      SurveyCore.CustomWidgetCollection.Instance.getCustomWidgetByName(
        'date-editor'
      ).showInToolbox = false;

      // Adds the inputType property to the date-editor type
      SurveyCore.Serializer.addProperty('date-editor', {
        name: 'inputType',
        type: 'text',
      });
    },
    afterRender: (question: Question, htmlElement: HTMLElement): void => {
      let pickerRef: ReturnType<typeof createPicker>;

      const updatePickerInstance = () => {
        pickerRef = createPicker(
          question.inputType as DateInputFormat,
          htmlElement
        );

        if (pickerRef) {
          const pickerInstance = pickerRef.instance;

          // initializes the picker value
          if (question.value) {
            pickerInstance.value = getDateDisplay(
              question.value,
              question.inputType
            );
          }

          // on picker value change, update the question value
          pickerInstance.registerOnChange((value: Date | null) => {
            if (value) {
              question.value = setDateValue(value, question.inputType);
            } else {
              question.value = null;
            }
          });
        }
      };

      // question inputType value change
      question.registerFunctionOnPropertyValueChanged('inputType', () => {
        if (pickerRef) pickerRef.destroy();
        updatePickerInstance();
      });

      // init
      updatePickerInstance();
    },
  };

  // registers custom widget as type
  SurveyCore.CustomWidgetCollection.Instance.add(widget, 'customtype');

  // registers custom property editor
  PropertyGridEditorCollection.register({
    fit: (prop: JsonObjectProperty) => prop.type === 'date-editor',
    getJSON: () => ({
      type: 'date-editor',
    }),
  });

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
   * Get date for input display.
   *
   * @param value question value
   * @param inputType question input type
   * @returns formatted date
   */
  const getDateDisplay = (value: any, inputType: string): Date => {
    const date = new Date(value);
    if (inputType === 'time') {
      return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    } else {
      return date;
    }
  };

  /**
   * It creates a date, datetime or time picker instance based on the input type
   *
   * @param inputType - The type of the input element.
   * @param element - The element that the directive is attached to.
   * @returns The picker instance, or null if the type is not allowed
   */
  const createPicker = (
    inputType: DateInputFormat,
    element: any
  ):
    | ComponentRef<DatePickerComponent>
    | ComponentRef<DateTimePickerComponent>
    | ComponentRef<TimePickerComponent>
    | null => {
    switch (inputType) {
      case 'date':
        const datePicker = domService.appendComponentToBody(
          DatePickerComponent,
          element
        );
        const datePickerInstance: DatePickerComponent = datePicker.instance;
        datePickerInstance.format = 'dd/MM/yyyy';
        return datePicker;
      case 'datetime':
      case 'datetime-local':
        const dateTimePicker = domService.appendComponentToBody(
          DateTimePickerComponent,
          element
        );
        const dateTimePickerInstance: DateTimePickerComponent =
          dateTimePicker.instance;
        dateTimePickerInstance.format = 'dd/MM/yyyy HH:mm';
        return dateTimePicker;
      case 'time':
        const timePicker = domService.appendComponentToBody(
          TimePickerComponent,
          element
        );
        const timePickerInstance: TimePickerComponent = timePicker.instance;
        timePickerInstance.format = 'HH:mm';
        return timePicker;
      default:
        return null;
    }
  };
};
