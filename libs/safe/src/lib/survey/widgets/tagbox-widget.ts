import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { DomService } from '../../services/dom/dom.service';
import { Question } from '../types';
import { QuestionSelectBase } from 'survey-knockout';

export const init = (Survey: any, domService: DomService): void => {
  const widget = {
    name: 'tagbox-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: Question): boolean => {
      console.log(question.getType());
      return question.getType() === 'tagbox';
    },
    isDefaultRender: true,
    afterRender: (question: QuestionSelectBase, el: HTMLInputElement): void => {
      // console.log(typeof question);
      // console.log(question);
      let tagboxDiv: HTMLDivElement | null = null;
      tagboxDiv = document.createElement('div');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tagboxInstance = createTagboxInstance(tagboxDiv);
      // dropdownInstance.choices = question.choices;
      el.parentElement?.appendChild(tagboxDiv);
      question.registerFunctionOnPropertyValueChanged(
        'choices',
        () => {
          console.log('there');
          // console.log(question.visibleChoices);
          // dropdownInstance.data = question.visibleChoices.map((choice) => ({
          //   text: choice.text,
          //   value: choice.value,
          // }));
          console.log(tagboxInstance.virtual);
          console.log(tagboxInstance.data);
        },
        el.id // a unique key to distinguish fields
      );
      question.registerFunctionOnPropertyValueChanged(
        'visibleChoices',
        () => {
          console.log('there');
          console.log(question.visibleChoices);
        },
        el.id // a unique key to distinguish fields
      );
    },
  };

  const createTagboxInstance = (element: any): MultiSelectComponent => {
    const tagbox = domService.appendComponentToBody(
      MultiSelectComponent,
      element
    );
    const tagboxInstance: MultiSelectComponent = tagbox.instance;
    tagboxInstance.virtual = {
      itemHeight: 28,
    };
    tagboxInstance.textField = 'text';
    tagboxInstance.valueField = 'value';
    tagboxInstance.data = [
      {
        text: 'choice 1',
        value: 'one',
      },
    ];
    return tagboxInstance;
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(
    widget,
    'customwidget'
  );
};
