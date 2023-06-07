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
    afterRender: (question: any, el: HTMLInputElement): void => {
      let tagboxDiv: HTMLDivElement | null = null;
      tagboxDiv = document.createElement('div');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tagboxInstance = createTagboxInstance(tagboxDiv);
      tagboxInstance.value = question.value;
      tagboxInstance.placeholder = question.placeholder;
      tagboxInstance.readonly = question.isReadOnly;
      tagboxInstance.disabled = question.isReadOnly;
      tagboxInstance.data = question.visibleChoices.map((choice: any) => ({
        text: choice.text,
        value: choice.value,
      }));
      tagboxInstance.registerOnChange((value: any) => {
        question.value = value;
      });
      el.parentElement?.appendChild(tagboxDiv);
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

  // there, we define that we want, with 'customtype', that the widget also appears in the list of questions
  Survey.CustomWidgetCollection.Instance.add(widget, 'customtype');
};
