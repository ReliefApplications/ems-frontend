import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { DomService } from '../../services/dom/dom.service';
import { Question } from '../types';

/**
 * Init tagbox question
 *
 * @param Survey Survey instance
 * @param domService Shared dom service
 */
export const init = (Survey: any, domService: DomService): void => {
  const iconId = 'icon-tagbox';

  // registers icon-resources in the SurveyJS library
  Survey.SvgRegistry.registerIconFromSvg(
    'tagbox',
    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g><path d="M15,11H0V5h15V11z M1,10h13V6H1V10z"/></g><rect x="2" y="7" width="4" height="2"/><rect x="7" y="7" width="4" height="2"/></svg>'
  );

  const componentName = 'tagbox';
  const widget = {
    name: 'tagbox',
    title: 'Tagbox',
    iconName: iconId,
    category: 'Custom Questions',
    defaultJSON: {
      choices: ['Item 1', 'Item 2', 'Item 3'],
    },
    widgetIsLoaded: (): boolean => true,
    isFit: (question: Question): boolean => {
      return question.getType() === componentName;
    },
    init: () => {
      if (Survey.Serializer.findClass(componentName)) return;
      Survey.Serializer.addClass(
        componentName,
        [
          { name: 'hasOther:boolean', visible: false },
          { name: 'hasSelectAll:boolean', visible: false },
          { name: 'hasNone:boolean', visible: false },
          { name: 'otherText', visible: false },
          { name: 'selectAllText', visible: false },
          { name: 'noneText', visible: false },
        ],
        null,
        'checkbox'
      );
      Survey.Serializer.addProperty(componentName, {
        name: 'placeholder',
        category: 'general',
        default: '',
      });
      Survey.Serializer.addProperty(componentName, {
        name: 'allowAddNewTag:boolean',
        category: 'general',
        default: false,
      });
    },
    isDefaultRender: false,
    htmlTemplate: '<div></div>',
    afterRender: (question: any, el: HTMLElement): void => {
      widget.willUnmount(question);
      let tagboxDiv: HTMLDivElement | null = null;
      tagboxDiv = document.createElement('div');
      tagboxDiv.id = 'tagbox';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tagboxInstance = createTagboxInstance(tagboxDiv);
      tagboxInstance.value = question.value;
      tagboxInstance.placeholder = question.placeholder;
      tagboxInstance.readonly = question.isReadOnly;
      tagboxInstance.disabled = question.isReadOnly;
      tagboxInstance.registerOnChange((value: any) => {
        question.value = value;
      });
      const updateChoices = () => {
        if (question.visibleChoices && Array.isArray(question.visibleChoices)) {
          tagboxInstance.data = question.visibleChoices.map((choice: any) =>
            typeof choice === 'string'
              ? {
                  text: choice,
                  value: choice,
                }
              : {
                  text: choice.text,
                  value: choice.value,
                }
          );
        }
      };
      question._propertyValueChangedVirtual = () => {
        updateChoices();
      };
      question.registerFunctionOnPropertyValueChanged(
        'visibleChoices',
        question._propertyValueChangedVirtual
      );
      question.registerFunctionOnPropertyValueChanged(
        'readOnly',
        (value: boolean) => {
          tagboxInstance.readonly = value;
          tagboxInstance.disabled = value;
        }
      );
      updateChoices();
      el.parentElement?.appendChild(tagboxDiv);
    },
    willUnmount: (question: any): void => {
      if (!question._propertyValueChangedVirtual) return;
      question.readOnlyChangedCallback = null;
      question.valueChangedCallback = null;
      question.unRegisterFunctionOnPropertyValueChanged(
        'visibleChoices',
        question._propertyValueChangedVirtual
      );
      question._propertyValueChangedVirtual = undefined;
    },
  };

  /**
   * Create the tagbox instance
   *
   * @param element html element
   * @returns multi select component
   */
  const createTagboxInstance = (element: any): MultiSelectComponent => {
    const tagbox = domService.appendComponentToBody(
      MultiSelectComponent,
      element
    );
    const tagboxInstance: MultiSelectComponent = tagbox.instance;
    tagboxInstance.virtual = {
      itemHeight: 28,
    };
    tagboxInstance.valuePrimitive = true;
    tagboxInstance.textField = 'text';
    tagboxInstance.valueField = 'value';
    return tagboxInstance;
  };

  // there, we define that we want, with 'customtype', that the widget also appears in the list of questions
  Survey.CustomWidgetCollection.Instance.add(widget, 'customtype');
};
