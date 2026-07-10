import { isNil } from 'lodash';
import { CustomWidgetCollection, SurveyModel } from 'survey-core';
import {
  CS_DOCUMENTS_PROPERTIES,
  DocumentManagementService,
} from '../../services/document-management/document-management.service';
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

/** Class toggled on the question root while the inline PDF preview is active. */
const PDF_PREVIEW_CLASS = 'file-pdf-preview';
/** CSS class of the iframe injected inside the upload area for PDFs. */
const PDF_PREVIEW_FRAME_CLASS = 'file-pdf-preview__frame';

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
 * Removes the inline PDF preview from the question element, revoking the blob
 * URL it held to avoid memory leaks.
 *
 * @param question File question instance
 * @param htmlElement The question's rendered root HTML element
 */
const removePdfPreview = (
  question: QuestionFile,
  htmlElement: HTMLElement
): void => {
  htmlElement.classList.remove(PDF_PREVIEW_CLASS);
  const wrapper = htmlElement.querySelector(
    '.sd-file__image-wrapper'
  ) as HTMLElement | null;
  if (wrapper) delete wrapper.dataset['pdfPreviewKey'];
  htmlElement.querySelector(`iframe.${PDF_PREVIEW_FRAME_CLASS}`)?.remove();
  // Revoke through the question-held reference rather than the iframe src, so
  // the blob is also released when SurveyJS already tore down the iframe.
  const url = (question as any).__pdfPreviewUrl;
  if (url && url.indexOf('blob:') === 0) URL.revokeObjectURL(url);
  (question as any).__pdfPreviewUrl = undefined;
};

/**
 * Renders a PDF preview inside SurveyJS's upload area, in the slot where the
 * default file icon normally sits, so single PDFs get the same in-place
 * preview experience as images. Images need no custom rendering: SurveyJS
 * already previews them natively inside the upload area (fed by the survey's
 * onDownloadFile handler through `previewValue`).
 *
 * Safe to call repeatedly (it is driven by a MutationObserver): a key stored
 * on the preview wrapper makes re-renders of the same file a no-op, and the
 * preview is removed whenever the value is no longer a single PDF.
 *
 * @param question File question instance
 * @param htmlElement The question's current rendered root HTML element
 */
const updatePdfPreview = (
  question: QuestionFile,
  htmlElement: HTMLElement
): void => {
  const value: Array<{ name: string; type: string }> = question.value;
  const file = Array.isArray(value) && value.length === 1 ? value[0] : null;
  const kind = file ? getPreviewKind(file.name, file.type) : null;
  // previewValue holds the downloaded file content (data / http URL), already
  // resolved by the survey's onDownloadFile handler for stored files.
  const preview = question.previewValue?.[0];
  const content =
    preview && typeof preview.content === 'string' ? preview.content : null;

  if (!file || kind !== 'pdf' || !content) {
    removePdfPreview(question, htmlElement);
    return;
  }

  const wrapper = htmlElement.querySelector(
    '.sd-file__image-wrapper'
  ) as HTMLElement | null;
  // Preview slot not rendered yet; the observer will call us again once it is.
  if (!wrapper) return;

  // Same file already rendered (or currently being resolved) -> no-op.
  const key = `${file.name}:${content.length}`;
  if (wrapper.dataset['pdfPreviewKey'] === key) return;
  wrapper.dataset['pdfPreviewKey'] = key;
  htmlElement.classList.add(PDF_PREVIEW_CLASS);

  const inject = (src: string): void => {
    // Discard if a newer file superseded us or the slot was re-rendered.
    if (!wrapper.isConnected || wrapper.dataset['pdfPreviewKey'] !== key) {
      if (src.indexOf('blob:') === 0) URL.revokeObjectURL(src);
      return;
    }
    wrapper.querySelector(`iframe.${PDF_PREVIEW_FRAME_CLASS}`)?.remove();
    const previous = (question as any).__pdfPreviewUrl;
    if (previous && previous !== src && previous.indexOf('blob:') === 0) {
      URL.revokeObjectURL(previous);
    }
    (question as any).__pdfPreviewUrl = src;
    const iframe = document.createElement('iframe');
    iframe.classList.add(PDF_PREVIEW_FRAME_CLASS);
    iframe.title = file.name;
    iframe.src = src;
    wrapper.appendChild(iframe);
  };

  if (content.indexOf('data:') === 0) {
    // Convert to a blob URL: browsers handle large PDFs better than data:
    // iframes. Force the PDF MIME type — stored files may lack one, and an
    // octet-stream src makes the browser download the file instead of
    // rendering it inline.
    fetch(content)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/pdf' });
        inject(URL.createObjectURL(blob));
      });
  } else {
    inject(content);
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

      // Give stored images the same native in-area preview as freshly picked
      // ones: SurveyJS only recognizes images from string contents, but files
      // stored through document management hold an object reference.
      if (!(question as any).__canPreviewImagePatched) {
        (question as any).__canPreviewImagePatched = true;
        const canPreviewImage = question.canPreviewImage.bind(question);
        question.canPreviewImage = (fileItem: any): boolean =>
          canPreviewImage(fileItem) ||
          (question.allowImagesPreview &&
            !!fileItem &&
            getPreviewKind(fileItem.name, fileItem.type) === 'image');
      }

      // Render the PDF preview inside the upload area, and keep it in sync
      // with SurveyJS re-renders (value changes, async preview loading).
      (question as any).__pdfPreviewObserver?.disconnect();
      const observer = new MutationObserver(() =>
        updatePdfPreview(question, htmlElement)
      );
      observer.observe(htmlElement, { childList: true, subtree: true });
      (question as any).__pdfPreviewObserver = observer;
      updatePdfPreview(question, htmlElement);
    },
  };

  customWidgetCollectionInstance.addCustomWidget(widget, 'customwidget');
};
