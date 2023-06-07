import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { DomService } from '../../services/dom/dom.service';
import { Question } from '../types';
import { QuestionDropdown } from 'survey-knockout';

export const init = (Survey: any, domService: DomService): void => {
  const widget = {
    name: 'dropdown-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: Question): boolean => question.getType() === 'dropdown',
    isDefaultRender: true,
    afterRender: (question: QuestionDropdown, el: HTMLInputElement): void => {
      console.log(typeof question);
      console.log(question);
      // remove default render
      el.parentElement?.querySelector('.sv_select_wrapper')?.remove();
      let dropdownDiv: HTMLDivElement | null = null;
      dropdownDiv = document.createElement('div');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dropdownInstance = createDropdownInstance(dropdownDiv);
      dropdownInstance.value = question.value;
      dropdownInstance.placeholder = question.placeholder;
      dropdownInstance.readonly = question.isReadOnly;
      dropdownInstance.disabled = question.isReadOnly;
      dropdownInstance.data = question.visibleChoices.map((choice) => ({
        text: choice.text,
        value: choice.value,
      }));
      dropdownInstance.registerOnChange((value: any) => {
        question.value = value;
      });
      el.parentElement?.appendChild(dropdownDiv);
    },
  };

  const createDropdownInstance = (element: any): ComboBoxComponent => {
    const dropdown = domService.appendComponentToBody(
      ComboBoxComponent,
      element
    );
    const dropdownInstance: ComboBoxComponent = dropdown.instance;
    // dropdownInstance.virtual = {
    //   itemHeight: 28,
    // };
    dropdownInstance.textField = 'text';
    dropdownInstance.valueField = 'value';
    console.log('ici');
    dropdownInstance.data = [
      {
        text: 'choice 1',
        value: 'one',
      },
    ];
    return dropdownInstance;
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(
    widget,
    'customwidget'
  );
};
