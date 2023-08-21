import { DateRangeComponent } from '@oort-front/ui';
import { DomService } from '../../services/dom/dom.service';
import { QuestionCustom, Survey } from 'survey-knockout';

/**
 * Inits the users component.
 *
 * @param Survey survey library
 * @param domService Dom service.
 */
export const init = (Survey: Survey, domService: DomService): void => {
  const component = {
    name: 'daterange',
    title: 'Date range',
    iconName: 'icon-daterange',
    category: 'Custom Questions',
    questionJSON: {
      type: 'text',
    },
    onInit: (): void => {
      // add dateMax property
      Survey.Serializer.addProperty('daterange', {
        name: 'dateMax:date',
        category: 'general',
        visibleIndex: 8,
      });

      // add dateMin property
      Survey.Serializer.addProperty('daterange', {
        name: 'dateMin:date',
        category: 'general',
        visibleIndex: 8,
      });

      Survey.Serializer.addProperty('daterange', {
        name: 'minValueExpression:expression',
        category: 'logic',
        onExecuteExpression: (obj: QuestionCustom, res: any) => {
          obj.setPropertyValue('dateMin', res);
        },
      });

      Survey.Serializer.addProperty('daterange', {
        name: 'maxValueExpression:expression',
        category: 'logic',
        onExecuteExpression: (obj: QuestionCustom, res: any) => {
          obj.setPropertyValue('dateMax', res);
        },
      });
    },

    onAfterRender: (question: QuestionCustom, el: HTMLElement): void => {
      // hides the input element
      const element = el.getElementsByTagName('input')[0].parentElement;
      if (element) element.style.display = 'none';

      // append DateRangeComponent using domService
      const dropdown = domService.appendComponentToBody(DateRangeComponent, el);
      const instance: DateRangeComponent = dropdown.instance;

      instance.hasInputs = true;

      // subscribe to changes
      instance.selectedValue.subscribe((value) => {
        question.value = [value.start, value.end];
      });

      const updateInstance = (): void => {
        let [startVal, endVal] = question.value ?? [];
        let min = question.dateMin;
        let max = question.dateMax;

        // if strings, convert to date
        if (typeof startVal === 'string') startVal = new Date(startVal);
        if (typeof endVal === 'string') endVal = new Date(endVal);
        if (typeof min === 'string') min = new Date(min);
        if (typeof max === 'string') max = new Date(max);

        instance.range = {
          start: startVal,
          end: endVal,
        };

        instance.min = min;
        instance.max = max;

        instance.disabled = question.readOnly;
      };

      // Subscribe to changes when minDate changes
      ['dateMax', 'dateMin', 'readOnly'].forEach((prop) => {
        question.registerFunctionOnPropertyValueChanged(
          prop,
          updateInstance,
          el.id // a unique key to distinguish fields
        );
      });

      // Init instance
      updateInstance();
    },
  };
  Survey.ComponentCollection.Instance.add(component);
};
