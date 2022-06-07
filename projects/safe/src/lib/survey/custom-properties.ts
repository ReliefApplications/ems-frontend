import { DomService } from '../services/dom.service';
import { ChoicesRestful } from 'survey-angular';
import { SafeButtonComponent } from '../components/ui/button/button.component';
import { ButtonSize } from '../components/ui/button/button-size.enum';
import { ButtonCategory } from '../components/ui/button/button-category.enum';
import { EmbeddedViewRef } from '@angular/core';

/**
 * Add support for custom properties to the survey
 *
 * @param Survey Survey library
 * @param environment Current environment
 */
export const initCustomProperties = (Survey: any, environment: any): void => {
  // add tooltip property
  Survey.Serializer.addProperty('question', {
    name: 'tooltip:text',
    category: 'general',
  });
  // override default expression properties
  Survey.Serializer.removeProperty('expression', 'readOnly');
  Survey.Serializer.addProperty('expression', {
    name: 'readOnly:boolean',
    type: 'boolean',
    visibleIndex: 6,
    default: false,
    category: 'general',
    required: true,
  });
  // Pass token before the request to fetch choices by URL if it's targeting SAFE API
  Survey.ChoicesRestfull.onBeforeSendRequest = (
    sender: ChoicesRestful,
    options: { request: XMLHttpRequest }
  ) => {
    if (sender.url.includes(environment.apiUrl)) {
      const token = localStorage.getItem('idtoken');
      options.request.setRequestHeader('Authorization', `Bearer ${token}`);
    }
  };
  Survey.Serializer.addProperty('survey', {
    name: 'onCompleteExpression:expression',
    type: 'expression',
    visibleIndex: 350,
    category: 'logic',
  });
};

/**
 * Render the custom properties
 *
 * @param domService The dom service
 * @returns A function which render the custom properties on a question
 */
export const renderCustomProperties =
  (domService: DomService): ((survey: any, options: any) => void) =>
  (_: any, options: { question: any; htmlElement: any }): void => {
    const el = options.htmlElement;
    const question = options.question;

    // Display of tooltip
    const header = el.parentElement.parentElement.querySelector('.sv_q_title');
    if (header) {
      header.title = question.tooltip;
      const span = document.createElement('span');
      span.innerText = 'help';
      span.className = 'material-icons';
      span.style.fontSize = '1em';
      span.style.cursor = 'pointer';
      span.style.color = '#008DC9';
      header.appendChild(span);
      span.style.display = !question.tooltip ? 'none' : '';
      question.registerFunctionOnPropertyValueChanged('tooltip', () => {
        span.style.display = !question.tooltip ? 'none' : '';
        header.title = question.tooltip;
      });
    }

    // Adding an open url icon for urls inputs
    if (question.inputType === 'url') {
      // Generate the dynamic component with its parameters
      const button = domService.appendComponentToBody(
        SafeButtonComponent,
        el.parentElement
      );
      const instance: SafeButtonComponent = button.instance;
      instance.isIcon = true;
      instance.icon = 'open_in_new';
      instance.size = ButtonSize.SMALL;
      instance.category = ButtonCategory.TERTIARY;
      instance.variant = 'default';
      // we override the css of the component
      const domElem = (button.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;
      (domElem.firstChild as HTMLElement).style.minWidth = 'unset';
      (domElem.firstChild as HTMLElement).style.backgroundColor = 'unset';
      (domElem.firstChild as HTMLElement).style.color = 'black';

      // Set the default styling of the parent
      el.parentElement.style.display = 'flex';
      el.parentElement.style.alignItems = 'center';
      el.parentElement.style.flexDirection = 'row';
      el.parentElement.style.pointerEvents = 'auto';
      el.parentElement.style.justifyContent = 'space-between';
      el.parentElement.title =
        'The URL should start with "http://" or "https://"';

      // Create an <a> HTMLElement only used to verify the validity of the URL
      const urlTester = document.createElement('a');
      if (
        el.value &&
        !(el.value.startsWith('https://') || el.value.startsWith('http://'))
      ) {
        urlTester.href = 'https://' + el.value;
      } else {
        urlTester.href = el.value || '';
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      urlTester.host && urlTester.host !== window.location.host
        ? (instance.disabled = false)
        : (instance.disabled = true);

      question.survey.onValueChanged.add((__: any, opt: any) => {
        if (opt.question.name === question.name) {
          if (
            el.value &&
            !(el.value.startsWith('https://') || el.value.startsWith('http://'))
          ) {
            urlTester.href = 'https://' + el.value;
          } else {
            urlTester.href = el.value || '';
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          urlTester.host && urlTester.host !== window.location.host
            ? (instance.disabled = false)
            : (instance.disabled = true);
        }
      });

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

    // define the max size for files
    if (question.getType() === 'file') {
      question.maxSize = 7340032;
    }
  };
