import { isNil } from 'lodash';
import { CustomWidgetCollection, SurveyModel } from 'survey-core';
import {
  CS_DOCUMENTS_PROPERTIES,
  DocumentManagementService,
} from '../../services/document-management/document-management.service';
import { Question, QuestionFile } from '../types';
import { Injector } from '@angular/core';
import jsonpath from 'jsonpath';
import { File as SurveyFile } from '../../services/file/file.service';
import { isFileOutdated } from '../../services/file/file-outdated.utils';

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

/** Class toggled on the question root to hide SurveyJS's default preview. */
const FILE_PREVIEW_ACTIVE_CLASS = 'file-preview-active';
/** Id of the stylesheet that hides the default preview when ours is active. */
const FILE_PREVIEW_STYLE_ID = 'shared-file-preview-style';
/** CSS class of the outdated controls injected for protected file fields. */
const FILE_OUTDATED_CONTROLS_CLASS = 'file-outdated-controls';
/** Class toggled on the question root when file removal should be blocked. */
const FILE_OUTDATED_MODE_CLASS = 'file-outdated-mode';
/** Class toggled when the configured file limit has already been reached. */
const FILE_LIMIT_REACHED_CLASS = 'file-limit-reached';

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
  // In display mode our custom preview fully replaces the default file UI, so
  // hide the whole default file widget container to avoid an empty drop-zone
  // element showing above the preview. Our preview wrapper is appended as a
  // sibling of the file widget (on the question root), so it stays visible.
  style.textContent =
    `.${FILE_PREVIEW_ACTIVE_CLASS} .sd-file,` +
    `.${FILE_PREVIEW_ACTIVE_CLASS} .sv-file { display: none !important; }` +
    `.${FILE_OUTDATED_MODE_CLASS} .sd-file__remove-file-button,` +
    `.${FILE_OUTDATED_MODE_CLASS} .sv-file__remove-file-button,` +
    `.${FILE_OUTDATED_MODE_CLASS} .sd-file__clean-btn,` +
    `.${FILE_OUTDATED_MODE_CLASS} .sv-file__clean-btn { display: none !important; }` +
    `.${FILE_OUTDATED_MODE_CLASS}.${FILE_LIMIT_REACHED_CLASS} .sd-file__choose-btn,` +
    `.${FILE_OUTDATED_MODE_CLASS}.${FILE_LIMIT_REACHED_CLASS} .sv-file__choose-btn { display: none !important; }` +
    `.${FILE_OUTDATED_CONTROLS_CLASS} { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }` +
    `.${FILE_OUTDATED_CONTROLS_CLASS} .file-outdated-row { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; }` +
    `.${FILE_OUTDATED_CONTROLS_CLASS} .file-outdated-name { font-weight: 500; }` +
    `.${FILE_OUTDATED_CONTROLS_CLASS} .file-outdated-status { align-items: center; color: #b45309; display: inline-flex; gap: 4px; }` +
    `.${FILE_OUTDATED_CONTROLS_CLASS} .file-limit-message { color: #6b7280; font-size: 12px; }` +
    `.${FILE_OUTDATED_CONTROLS_CLASS} button { align-items: center; border: none; cursor: pointer; display: inline-flex; gap: 4px; justify-content: flex-start; padding: 4px 6px; }` +
    `.${FILE_OUTDATED_CONTROLS_CLASS} .file-outdated { color: #b45309; }`;
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
 * Renders controls that let users mark/unmark files as outdated instead of removing them.
 *
 * @param question File question instance
 * @param htmlElement The question's current rendered root HTML element
 */
const updateOutdatedControls = (
  question: QuestionFile,
  htmlElement: HTMLElement
): void => {
  ensureFilePreviewStyles();
  const canDeleteFiles = question.canDeleteFiles !== false;
  htmlElement.classList.toggle(
    FILE_OUTDATED_MODE_CLASS,
    question.allowOutdatedFiles === true && !canDeleteFiles
  );
  htmlElement.querySelector(`.${FILE_OUTDATED_CONTROLS_CLASS}`)?.remove();
  htmlElement.classList.remove(FILE_LIMIT_REACHED_CLASS);

  if (question.allowOutdatedFiles !== true) {
    return;
  }

  const files = Array.isArray(question.value)
    ? (question.value as SurveyFile[])
    : [];
  const limit = question.allowMultiple
    ? Number(question.getPropertyValue('allowedFileNumber'))
    : 1;
  const activeFilesCount = files.filter((f) => !isFileOutdated(f)).length;
  const limitReached = activeFilesCount >= limit;
  htmlElement.classList.toggle(FILE_LIMIT_REACHED_CLASS, limitReached);
  if (files.length === 0) {
    return;
  }

  const controls = document.createElement('div');
  controls.classList.add(FILE_OUTDATED_CONTROLS_CLASS);
  files.forEach((file, index) => {
    const outdated = isFileOutdated(file);
    if (question.isReadOnly && !outdated) {
      return;
    }

    const row = document.createElement('div');
    row.className = 'file-outdated-row';

    if (files.length > 1 || question.isReadOnly) {
      const name = document.createElement('span');
      name.className = 'file-outdated-name';
      name.textContent = file.name;
      row.appendChild(name);
    }

    if (outdated) {
      const status = document.createElement('span');
      status.className = 'file-outdated-status';
      const statusIcon = document.createElement('span');
      statusIcon.className = 'k-icon k-i-warning file-outdated';
      const statusLabel = document.createElement('span');
      statusLabel.textContent = 'Outdated';
      status.appendChild(statusIcon);
      status.appendChild(statusLabel);
      row.appendChild(status);
    }

    if (question.isReadOnly) {
      controls.appendChild(row);
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'k-button k-button-flat k-button-flat-base';
    button.title = outdated
      ? 'Remove outdated status'
      : 'Mark file as outdated';
    const icon = document.createElement('span');
    icon.className = `k-icon ${outdated ? 'k-i-undo' : 'k-i-warning'}`;
    const label = document.createElement('span');
    label.textContent = outdated ? 'Restore file' : 'Mark as outdated';
    button.appendChild(icon);
    button.appendChild(label);
    button.addEventListener('click', () => {
      const nextValue = files.map((currentFile, currentIndex) =>
        currentIndex === index
          ? { ...currentFile, outdated: !isFileOutdated(currentFile) }
          : currentFile
      );
      question.value = nextValue;
      (question.survey as SurveyModel)?.setValue(question.name, nextValue);
      updateOutdatedControls(question, htmlElement);
    });
    row.appendChild(button);
    controls.appendChild(row);
  });

  if (!question.isReadOnly && limitReached) {
    const message = document.createElement('div');
    message.className = 'file-limit-message';
    message.textContent =
      'File limit reached. Existing and outdated files count toward the limit.';
    controls.appendChild(message);
  }
  if (controls.childNodes.length > 0) {
    htmlElement.appendChild(controls);
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

      // Keep a live reference to the current element so the value-change
      // handler always targets the latest rendered DOM.
      (question as any).__filePreviewEl = htmlElement;

      // Render the preview for the current value.
      updatePdfPreview(question, htmlElement);
      updateOutdatedControls(question, htmlElement);

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
            setTimeout(() => {
              updatePdfPreview(question, el);
              updateOutdatedControls(question, el);
            }, 0);
          }
        );
      }

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
