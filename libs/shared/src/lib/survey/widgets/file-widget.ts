import { isNil } from 'lodash';
import { CustomWidgetCollection, SurveyModel } from 'survey-core';
import { firstValueFrom } from 'rxjs';
import {
  CS_DOCUMENTS_PROPERTIES,
  DocumentManagementService,
} from '../../services/document-management/document-management.service';
import { RestService } from '../../services/rest/rest.service';
import { Question, QuestionFile } from '../types';
import { Injector } from '@angular/core';
import jsonpath from 'jsonpath';

/**
 * Set document properties based on value expressions
 *
 * @param documentManagementService Document management service
 * @param question Question instance
 * @param sender Survey model instance
 */
const setDocumentProperties = (
  documentManagementService: DocumentManagementService,
  question: QuestionFile,
  sender: SurveyModel
): void => {
  CS_DOCUMENTS_PROPERTIES.filter(
    (prop) =>
      prop.bodyKey && !!question[`valueExpression${prop.bodyKey as string}`]
  ).forEach(async (cs) => {
    const result = sender.runExpression(
      question[`valueExpression${cs.bodyKey}`]
    );
    // Set field parameter
    if (!isNil(result) && question[`convertFrom${cs.bodyKey}`]) {
      // If expression not build from ids, execute graphql query to get list of ids, filtering by the expression result
      const filterValue = Array.isArray(result) ? result : [result];
      const query = documentManagementService.filterQuery(
        cs.value,
        question[`convertFrom${cs.bodyKey}`],
        filterValue
      );
      await query.then(({ data }) => {
        const ids = jsonpath.query(data, `$.${cs.value}[*].id`);
        question[cs.bodyKey as string] = ids;
      });
    } else {
      // Else, expression returns a list of ids, set the field parameter from this list
      const propertyValue = !isNil(result)
        ? Array.isArray(result)
          ? result
          : [result]
        : result;
      question[cs.bodyKey as string] = propertyValue;
    }
  });
  // Specific for occurrence, we don't need to build an array
  if (question['valueExpressionOccurrence']) {
    const result = sender.runExpression(question['valueExpressionOccurrence']);
    question['Occurrence'] = result;
  }
};

/** Services needed to resolve and render an inline file preview. */
interface FilePreviewDeps {
  documentManagementService: DocumentManagementService;
  restService: RestService;
  environment: any;
}

/** CSS class of the custom preview wrapper we inject. */
const FILE_PREVIEW_CLASS = 'file-preview';
/** Class toggled on the question root to hide SurveyJS's default preview. */
const FILE_PREVIEW_ACTIVE_CLASS = 'file-preview-active';
/** Id of the stylesheet that hides the default preview when ours is active. */
const FILE_PREVIEW_STYLE_ID = 'shared-file-preview-style';

/**
 * Injects (once) the stylesheet that hides SurveyJS's default file list while
 * our custom preview is active. Hiding via a class on the stable question root
 * (rather than inline styles on the list) survives SurveyJS re-rendering the
 * list on every value change.
 */
const ensureFilePreviewStyles = (): void => {
  if (document.getElementById(FILE_PREVIEW_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = FILE_PREVIEW_STYLE_ID;
  style.textContent =
    `.${FILE_PREVIEW_ACTIVE_CLASS} .sd-file__list,` +
    `.${FILE_PREVIEW_ACTIVE_CLASS} .sv-file__list { display: none !important; }`;
  document.head.appendChild(style);
};

/**
 * Determines whether a file can be previewed inline and how.
 *
 * @param name File name (used for extension sniffing)
 * @param type File MIME type, when known
 * @returns 'image' | 'pdf' for files we can preview, otherwise null
 */
const getPreviewKind = (name: string, type: string): 'image' | 'pdf' | null => {
  const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|bmp|svg)$/i;
  const isImage =
    (typeof type === 'string' && type.startsWith('image/')) ||
    (!type && IMAGE_EXTENSIONS.test(name));
  if (isImage) return 'image';
  const isPdf = type === 'application/pdf' || (!type && /\.pdf$/i.test(name));
  return isPdf ? 'pdf' : null;
};

/**
 * Removes the custom preview previously injected in the question element,
 * revoking any blob URL it held to avoid memory leaks.
 *
 * @param htmlElement The question's rendered root HTML element
 */
const removeCustomPreview = (htmlElement: HTMLElement): void => {
  const existing = htmlElement.querySelector(`.${FILE_PREVIEW_CLASS}`);
  if (!existing) return;
  const media = existing.querySelector('img, iframe') as
    | HTMLImageElement
    | HTMLIFrameElement
    | null;
  if (media && media.src.indexOf('blob:') === 0) {
    URL.revokeObjectURL(media.src);
  }
  existing.remove();
};

/**
 * Builds the preview wrapper holding an <img> (image) or <iframe> (PDF).
 *
 * @param src Blob URL or direct URL of the file to preview
 * @param fileName File name used as alt text / title
 * @param isImage True renders an img; false renders an iframe for PDF
 * @returns The preview wrapper element
 */
const buildPreviewWrapper = (
  src: string,
  fileName: string,
  isImage: boolean
): HTMLElement => {
  const wrapper = document.createElement('div');
  wrapper.classList.add(FILE_PREVIEW_CLASS);
  wrapper.style.marginTop = '8px';

  if (isImage) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = fileName;
    img.style.maxWidth = '100%';
    img.style.display = 'block';
    wrapper.appendChild(img);
  } else {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = fileName;
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    wrapper.appendChild(iframe);
  }
  return wrapper;
};

/**
 * Re-evaluates the current question value and (re)renders the inline preview in
 * place of SurveyJS's default file preview. Safe to call repeatedly: it clears
 * the previous custom preview first and restores the default preview whenever
 * the value is no longer a single previewable image / PDF.
 *
 * A monotonic sequence number stored on the question discards stale async
 * results, so rapid value changes always settle on the latest file.
 *
 * @param deps Services needed to resolve the file source
 * @param question File question instance
 * @param htmlElement The question's current rendered root HTML element
 */
const updateFilePreview = (
  deps: FilePreviewDeps,
  question: QuestionFile,
  htmlElement: HTMLElement
): void => {
  const survey = question.survey as SurveyModel;

  // Bump the sequence so any in-flight async resolution becomes stale.
  const seq = ((question as any).__filePreviewSeq || 0) + 1;
  (question as any).__filePreviewSeq = seq;

  // Start from a clean slate.
  removeCustomPreview(htmlElement);

  const hasRecord = !!survey?.getPropertyValue('record');
  const isDisplayMode = survey?.mode === 'display';
  const value: Array<{ name: string; type: string; content: any }> =
    question.value;
  const file = Array.isArray(value) && value.length === 1 ? value[0] : null;
  const kind = file ? getPreviewKind(file.name, file.type) : null;

  // Not previewable -> show SurveyJS's default preview again and stop.
  if (!survey || (!hasRecord && !isDisplayMode) || !file || !kind) {
    htmlElement.classList.remove(FILE_PREVIEW_ACTIVE_CLASS);
    return;
  }

  // In display mode the preview fully replaces the default file list. In edit
  // mode (updating a record) we keep the default list visible so users can
  // still remove / download the file, and render the preview below it.
  if (isDisplayMode) {
    ensureFilePreviewStyles();
    htmlElement.classList.add(FILE_PREVIEW_ACTIVE_CLASS);
  } else {
    htmlElement.classList.remove(FILE_PREVIEW_ACTIVE_CLASS);
  }

  const { name, content } = file;
  const isImage = kind === 'image';

  const inject = (src: string): void => {
    // Discard if a newer change superseded us or the element was detached.
    if ((question as any).__filePreviewSeq !== seq || !htmlElement.isConnected) {
      return;
    }
    removeCustomPreview(htmlElement);
    htmlElement.appendChild(buildPreviewWrapper(src, name, isImage));
  };

  const fetchAndInject = (token: string, url: string): void => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if ((question as any).__filePreviewSeq !== seq) return;
      if (xhr.status < 200 || xhr.status >= 300) return;
      inject(URL.createObjectURL(xhr.response));
    };
    xhr.send();
  };

  if (typeof content === 'string') {
    // data: (just selected, not yet uploaded) and http(s) URLs are usable as-is.
    if (content.indexOf('data:') === 0 || content.indexOf('http') === 0) {
      inject(content);
    } else {
      const token = localStorage.getItem('idtoken') as string;
      fetchAndInject(
        token,
        `${deps.restService.apiUrl}/download/file/${content}`
      );
    }
  } else {
    firstValueFrom(
      deps.documentManagementService.getDocumentDriveId(content.itemId)
    ).then((driveId) => {
      if ((question as any).__filePreviewSeq !== seq) return;
      const token = localStorage.getItem('access_token') as string;
      const url = `${deps.environment.csApiUrl}/documents/drives/${driveId}/items/${content.itemId}/content`;
      fetchAndInject(token, url);
    });
  }
};

/**
 * Update file widget in order to be able to update properties with value expressions
 *
 * @param injector Parent instance angular injector containing all needed services and directives
 * @param customWidgetCollectionInstance CustomWidgetCollection
 */
export const init = (
  injector: Injector,
  customWidgetCollectionInstance: CustomWidgetCollection
): void => {
  const documentManagementService = injector.get(DocumentManagementService);
  const previewDeps: FilePreviewDeps = {
    documentManagementService,
    restService: injector.get(RestService),
    environment: injector.get('environment'),
  };
  const widget = {
    name: 'file-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: Question): boolean => question.getType() === 'file',
    isDefaultRender: true,
    afterRender: (question: QuestionFile, htmlElement: HTMLElement): void => {
      // Subscribe to changes, to set all value expressions
      (question.survey as SurveyModel)?.onValueChanged.add((sender) => {
        setDocumentProperties(documentManagementService, question, sender);
      });
      // Execute once to set initial values
      setDocumentProperties(
        documentManagementService,
        question,
        question.survey as SurveyModel
      );

      // Keep a live reference to the current element so the value-change
      // handler always targets the latest rendered DOM.
      (question as any).__filePreviewEl = htmlElement;

      // Render the preview for the current value.
      updateFilePreview(previewDeps, question, htmlElement);

      // Re-render the preview whenever this question's value changes. Subscribe
      // once per question to avoid stacking handlers across re-renders.
      if (!(question as any).__filePreviewSubscribed) {
        (question as any).__filePreviewSubscribed = true;
        (question.survey as SurveyModel)?.onValueChanged.add(
          (_sender, options: any) => {
            if (options?.name !== question.name) return;
            const el = (question as any).__filePreviewEl as HTMLElement;
            if (!el) return;
            // Defer so SurveyJS finishes its own DOM update first.
            setTimeout(() => updateFilePreview(previewDeps, question, el), 0);
          }
        );
      }
    },
  };

  customWidgetCollectionInstance.addCustomWidget(widget, 'customwidget');
};
