import { isNil } from 'lodash';
import {
  CustomWidgetCollection,
  SurveyModel,
  ValueChangedEvent,
} from 'survey-core';
import {
  CS_DOCUMENTS_PROPERTIES,
  DocumentManagementService,
} from '../../services/document-management/document-management.service';
import { Question, QuestionFile } from '../types';
import { ComponentRef, Injector } from '@angular/core';
import jsonpath from 'jsonpath';
import { File } from '../../services/file/file.service';
import { DomService } from '../../services/dom/dom.service';
import { FileDownloadButtonComponent } from '../components/file-download-button/public-api';

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

/** File question state retained between widget lifecycle hooks. */
interface FilePreviewQuestion extends QuestionFile {
  __filePreviewElement?: HTMLElement;
  __pdfPreviewObserver?: MutationObserver;
  __imageDownloadButton?: ComponentRef<FileDownloadButtonComponent>;
  __survey?: SurveyModel;
  __valueChangedHandler?: (
    sender: SurveyModel,
    options: ValueChangedEvent
  ) => void;
}

/**
 * Determines whether a file can be previewed inline and how.
 *
 * @param name File name (used for extension sniffing)
 * @param type File MIME type, when known
 * @returns 'image' | 'pdf' for files we can preview, otherwise null
 */
const getPreviewKind = (name: string, type: string): 'image' | 'pdf' | null => {
  const IMAGE_EXTENSIONS = /\.(apng|avif|bmp|gif|jpe?g|png|svg|webp)$/i;
  const hasGenericType = !type || type === 'application/octet-stream';
  const isImage =
    (typeof type === 'string' && type.startsWith('image/')) ||
    (hasGenericType && IMAGE_EXTENSIONS.test(name));
  if (isImage) return 'image';
  const isPdf =
    type === 'application/pdf' || (hasGenericType && /\.pdf$/i.test(name));
  return isPdf ? 'pdf' : null;
};

/**
 * Removes the image download action from a file question, destroying the
 * injected component.
 *
 * @param question File question instance
 * @param domService Shared DOM service
 */
const removeImageDownloadAction = (
  question: FilePreviewQuestion,
  domService: DomService
): void => {
  if (question.__imageDownloadButton) {
    domService.removeComponentFromBody(question.__imageDownloadButton);
    question.__imageDownloadButton = undefined;
  }
};

/**
 * Injects a download action floating over a single image preview.
 *
 * SurveyJS renders single images without any visible download control (the
 * file-name link is transparent and stretched over the image), in both edit
 * and read-only mode. The action is a UI library button injected inside the
 * image wrapper, kept in sync with the question value.
 *
 * Safe to call repeatedly (it is driven by a MutationObserver): the injected
 * component is reused while SurveyJS keeps the same wrapper, re-created when
 * the wrapper is re-rendered, and removed once the value is no longer a
 * single image.
 *
 * @param question File question instance
 * @param htmlElement The question's rendered root HTML element
 * @param domService Shared DOM service
 */
const updateImageDownloadAction = (
  question: FilePreviewQuestion,
  htmlElement: HTMLElement,
  domService: DomService
): void => {
  const value = question.value as File[];
  const file = Array.isArray(value) && value.length === 1 ? value[0] : null;
  const isImage = file
    ? getPreviewKind(file.name, file.type ?? '') === 'image'
    : false;
  const wrapper = htmlElement.querySelector(
    '.sd-file__image-wrapper'
  ) as HTMLElement | null;

  // Preview slot not rendered yet; the observer will call us again once it is.
  if (!file || !isImage || !wrapper) {
    removeImageDownloadAction(question, domService);
    return;
  }

  let button = question.__imageDownloadButton;
  // SurveyJS re-rendered the preview: the previous button is orphaned
  if (button && !wrapper.contains(button.location.nativeElement)) {
    removeImageDownloadAction(question, domService);
    button = undefined;
  }
  if (!button) {
    button = domService.appendComponentToBody(
      FileDownloadButtonComponent,
      wrapper
    ) as ComponentRef<FileDownloadButtonComponent>;
    question.__imageDownloadButton = button;
  }
  if (button.instance.file !== file) {
    button.instance.file = file;
    button.changeDetectorRef.detectChanges();
  }
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
  const domService = injector.get(DomService);
  const widget = {
    name: 'file-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: Question): boolean => question.getType() === 'file',
    isDefaultRender: true,
    afterRender: (question: QuestionFile, htmlElement: HTMLElement): void => {
      const filePreviewQuestion = question as FilePreviewQuestion;
      const survey = question.survey as SurveyModel;
      filePreviewQuestion.__filePreviewElement = htmlElement;
      // Subscribe to changes, to set all value expressions
      if (
        filePreviewQuestion.__survey &&
        filePreviewQuestion.__valueChangedHandler
      ) {
        filePreviewQuestion.__survey.onValueChanged.remove(
          filePreviewQuestion.__valueChangedHandler
        );
      }
      const valueChangedHandler = (sender: SurveyModel): void => {
        setDocumentProperties(documentManagementService, question, sender);
      };
      survey?.onValueChanged.add(valueChangedHandler);
      filePreviewQuestion.__survey = survey;
      filePreviewQuestion.__valueChangedHandler = valueChangedHandler;
      // Execute once to set initial values
      setDocumentProperties(documentManagementService, question, survey);

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
      filePreviewQuestion.__pdfPreviewObserver?.disconnect();
      const observer = new MutationObserver(() => {
        updatePdfPreview(question, htmlElement);
        updateImageDownloadAction(filePreviewQuestion, htmlElement, domService);
      });
      observer.observe(htmlElement, { childList: true, subtree: true });
      filePreviewQuestion.__pdfPreviewObserver = observer;
      updatePdfPreview(question, htmlElement);
      updateImageDownloadAction(filePreviewQuestion, htmlElement, domService);
    },
    willUnmount: (question: QuestionFile): void => {
      const filePreviewQuestion = question as FilePreviewQuestion;
      filePreviewQuestion.__pdfPreviewObserver?.disconnect();
      if (
        filePreviewQuestion.__survey &&
        filePreviewQuestion.__valueChangedHandler
      ) {
        filePreviewQuestion.__survey.onValueChanged.remove(
          filePreviewQuestion.__valueChangedHandler
        );
      }
      if (filePreviewQuestion.__filePreviewElement) {
        removePdfPreview(question, filePreviewQuestion.__filePreviewElement);
      }
      removeImageDownloadAction(filePreviewQuestion, domService);
      filePreviewQuestion.__pdfPreviewObserver = undefined;
      filePreviewQuestion.__filePreviewElement = undefined;
      filePreviewQuestion.__survey = undefined;
      filePreviewQuestion.__valueChangedHandler = undefined;
    },
  };

  customWidgetCollectionInstance.addCustomWidget(widget, 'customwidget');
};
