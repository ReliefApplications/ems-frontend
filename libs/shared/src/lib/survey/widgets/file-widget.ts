import { isNil } from 'lodash';
import { CustomWidgetCollection, SurveyModel } from 'survey-core';
import {
  CS_DOCUMENTS_PROPERTIES,
  DocumentManagementService,
} from '../../services/document-management/document-management.service';
import { Question, QuestionFile, QuestionFileValueItem } from '../types';
import { Injector } from '@angular/core';
import jsonpath from 'jsonpath';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';

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
/** CSS class of the small control injected on each persisted file to toggle its outdated flag. */
const OUTDATED_TOGGLE_CLASS = 'file-outdated-toggle';
/** Class toggled on the outdated control when the file is currently flagged. */
const OUTDATED_TOGGLE_ACTIVE_CLASS = 'file-outdated-toggle--active';

/**
 * Builds a reasonably stable identity for a file value entry, used to tell
 * apart files that were already persisted on the record from files just
 * added in the current editing session (which don't carry a stable id).
 *
 * @param file File value entry (or preview entry)
 * @returns Identity key, stable across re-renders of the same file
 */
const getFileKey = (file: {
  name?: string;
  content?: unknown;
}): string | null => {
  if (!file || !file.name) return null;
  const contentLength =
    typeof file.content === 'string' ? file.content.length : '';
  return `${file.name}:${contentLength}`;
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
 * Captures the identity of the files present on the question when it is
 * first rendered (i.e. the files already persisted on the record), so later
 * calls can tell them apart from files only added during this editing
 * session. Safe to call repeatedly: only the first call has any effect.
 *
 * @param question File question instance
 */
const capturePersistedFiles = (question: QuestionFile): void => {
  if ((question as any).__persistedFileKeys) return;
  const initialValue: QuestionFileValueItem[] = Array.isArray(question.value)
    ? question.value
    : [];
  (question as any).__persistedFileKeys = new Set(
    initialValue.map(getFileKey).filter((key): key is string => !!key)
  );
};

/**
 * Shows a snackbar telling the user a persisted file cannot be deleted from
 * this widget.
 *
 * @param snackBar Snackbar service
 * @param translate Translate service
 */
const notifyDeleteBlocked = (
  snackBar: SnackbarService,
  translate: TranslateService
): void => {
  snackBar.openSnackBar(translate.instant('common.file.deleteBlocked'), {
    error: true,
  });
};

/**
 * Patches the question instance so that removing a persisted file is a
 * no-op (with a toast notification) when `preventDeleteExistingFiles` is
 * enabled. Files added during the current session (not part of the
 * persisted snapshot) remain removable. Safe to call repeatedly: only the
 * first call actually patches the instance.
 *
 * @param question File question instance
 * @param snackBar Snackbar service, used to notify the user of a blocked deletion
 * @param translate Translate service
 */
const applyDeleteProtection = (
  question: QuestionFile,
  snackBar: SnackbarService,
  translate: TranslateService
): void => {
  if ((question as any).__deleteProtectionPatched) return;
  (question as any).__deleteProtectionPatched = true;

  /**
   * Whether the given file entry is protected from deletion right now.
   *
   * @param file File value entry being removed
   * @returns True when the file is persisted and deletion is disabled
   */
  const isProtected = (file: QuestionFileValueItem | null | undefined) => {
    if (!question.getPropertyValue('preventDeleteExistingFiles')) {
      return false;
    }
    const key = file && getFileKey(file);
    const persistedKeys: Set<string> =
      (question as any).__persistedFileKeys || new Set();
    return !!key && persistedKeys.has(key);
  };

  // Entry point used when removing a single file (remove button on each
  // file item, and the `removeFile(name)` public API).
  const originalRemoveFileByContent = (
    question as any
  ).removeFileByContent.bind(question);
  (question as any).removeFileByContent = (content: any) => {
    if (isProtected(content)) {
      notifyDeleteBlocked(snackBar, translate);
      return;
    }
    originalRemoveFileByContent(content);
  };

  // Entry point used to clear the whole value: the explicit "clear" button,
  // and (for single-file questions) the implicit clear SurveyJS performs
  // before loading a replacement file.
  const originalClear = question.clear.bind(question);
  question.clear = (doneCallback?: () => void) => {
    const currentValue: QuestionFileValueItem[] = Array.isArray(
      question.value
    )
      ? question.value
      : question.value
      ? [question.value]
      : [];
    if (currentValue.some(isProtected)) {
      notifyDeleteBlocked(snackBar, translate);
      return;
    }
    originalClear(doneCallback);
  };
};

/**
 * Injects a small warning-icon control on each rendered persisted file item,
 * letting users flag/unflag it as outdated, and hides outdated files from
 * the rendered list when the question's `showOutdatedFiles` property is
 * disabled (without touching the underlying stored value).
 *
 * Safe to call repeatedly (driven by the same MutationObserver as the PDF
 * preview): existing controls are updated in place rather than recreated.
 *
 * @param question File question instance
 * @param htmlElement The question's current rendered root HTML element
 * @param translate Translate service, used for the control's tooltip
 */
const syncOutdatedFiles = (
  question: QuestionFile,
  htmlElement: HTMLElement,
  translate: TranslateService
): void => {
  const value: QuestionFileValueItem[] = Array.isArray(question.value)
    ? question.value
    : [];
  const persistedKeys: Set<string> =
    (question as any).__persistedFileKeys || new Set();
  const showOutdatedFiles =
    question.getPropertyValue('showOutdatedFiles') !== false;

  const items = Array.from(
    htmlElement.querySelectorAll('.sd-file__preview')
  ) as HTMLElement[];

  items.forEach((item, index) => {
    const fileValue = value[index];
    const wrapper = item.querySelector(
      '.sd-file__image-wrapper'
    ) as HTMLElement | null;
    if (!fileValue || !wrapper) {
      item.style.removeProperty('display');
      return;
    }
    const key = getFileKey(fileValue);
    const isPersisted = !!key && persistedKeys.has(key);

    // Only persisted files can be flagged as outdated: newly added files
    // are not saved yet, so the concept doesn't apply to them.
    if (!isPersisted) {
      item.style.removeProperty('display');
      return;
    }

    const isOutdated = !!fileValue.outdated;
    // Hide outdated files from the list when configured to do so. The
    // underlying value keeps the entry (and its `outdated` flag) intact.
    item.style.display = isOutdated && !showOutdatedFiles ? 'none' : '';

    // Anchor the control to the preview item itself (SurveyJS always
    // positions it), floating over the top of the preview, so it stays
    // visible without scrolling regardless of preview mode (wide single
    // image, small tile, default icon, ...).
    const host = item;
    let toggle = item.querySelector(
      `.${OUTDATED_TOGGLE_CLASS}`
    ) as HTMLButtonElement | null;
    if (toggle && toggle.parentElement !== host) {
      host.appendChild(toggle);
    }
    if (!toggle) {
      const newToggle = document.createElement('button');
      newToggle.type = 'button';
      newToggle.className = OUTDATED_TOGGLE_CLASS;
      const icon = document.createElement('i');
      icon.className = 'material-icons';
      icon.textContent = 'warning';
      newToggle.appendChild(icon);
      newToggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        // Re-read the target file by key at click time (rather than
        // closing over the index), so a value mutated/reordered elsewhere
        // in between renders still gets the right entry flagged.
        const targetKey = newToggle.dataset['fileKey'];
        const currentValue: QuestionFileValueItem[] = Array.isArray(
          question.value
        )
          ? [...question.value]
          : [];
        const targetIndex = currentValue.findIndex(
          (f) => getFileKey(f) === targetKey
        );
        if (targetIndex === -1) return;
        currentValue[targetIndex] = {
          ...currentValue[targetIndex],
          outdated: !currentValue[targetIndex].outdated,
        };
        question.value = currentValue;
      });
      host.appendChild(newToggle);
      toggle = newToggle;
    }
    toggle.dataset['fileKey'] = key as string;
    toggle.classList.toggle(OUTDATED_TOGGLE_ACTIVE_CLASS, isOutdated);
    toggle.title = translate.instant(
      isOutdated ? 'common.file.unmarkOutdated' : 'common.file.markOutdated'
    );
  });
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
  const snackBar = injector.get(SnackbarService);
  const translate = injector.get(TranslateService);
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

      // Snapshot which files are already persisted on the record, before any
      // edits happen in this session, and block their deletion when
      // configured to do so.
      capturePersistedFiles(question);
      applyDeleteProtection(question, snackBar, translate);

      // Render the PDF preview inside the upload area, and keep it in sync
      // with SurveyJS re-renders (value changes, async preview loading).
      // Also (re)synchronize the outdated-file toggles and visibility on
      // every re-render, following the same pattern.
      (question as any).__pdfPreviewObserver?.disconnect();
      const observer = new MutationObserver(() => {
        updatePdfPreview(question, htmlElement);
        syncOutdatedFiles(question, htmlElement, translate);
      });
      observer.observe(htmlElement, { childList: true, subtree: true });
      (question as any).__pdfPreviewObserver = observer;
      updatePdfPreview(question, htmlElement);
      syncOutdatedFiles(question, htmlElement, translate);
    },
  };

  customWidgetCollectionInstance.addCustomWidget(widget, 'customwidget');
};
