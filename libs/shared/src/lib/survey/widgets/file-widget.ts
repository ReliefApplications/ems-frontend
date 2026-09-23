import { isNil, omit } from 'lodash';
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
import { FileItemActionsComponent } from '../components/file-item-actions/public-api';
import { FileQuestionActionsComponent } from '../components/file-question-actions/public-api';
import { isOutdatedFile, isStoredFile } from '../../services/file/file.utils';
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
/** Class toggled on preview items hidden because their file is outdated. */
const OUTDATED_HIDDEN_CLASS = 'file-item--hidden';
/** Class toggled on the question root when a stored single file locks uploads. */
const SINGLE_LOCKED_CLASS = 'file-single-locked';
/** Class toggled on the question root while it holds at least one file. */
const ANSWERED_CLASS = 'file-question--answered';
/** SurveyJS class giving a single image the full-size in-area preview. */
const SINGLE_IMAGE_CLASS = 'sd-file--single-image';
/** Class toggled on the question root when files render as a plain list. */
const LIST_LAYOUT_CLASS = 'file-question--list';
/** Class of the warning icon injected next to outdated file names. */
const OUTDATED_ICON_CLASS = 'file-item__outdated-icon';
/** CSS class of the iframe injected inside the upload area for PDFs. */
const PDF_PREVIEW_FRAME_CLASS = 'file-pdf-preview__frame';

/** File question state retained between widget lifecycle hooks. */
interface FilePreviewQuestion extends QuestionFile {
  __filePreviewElement?: HTMLElement;
  __pdfPreviewObserver?: MutationObserver;
  __fileItemActions?: Map<number, ComponentRef<FileItemActionsComponent>>;
  __questionActions?: ComponentRef<FileQuestionActionsComponent>;
  __dropBlocker?: (event: Event) => void;
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
 * Files of the question that are displayed: outdated files are left out when
 * the question is configured not to display them. They stay in the question
 * value ( and get saved ), they are only hidden from the rendering.
 *
 * @param question File question instance
 * @returns Displayed files
 */
const getDisplayedFiles = (question: QuestionFile): File[] => {
  const value: File[] = Array.isArray(question.value) ? question.value : [];
  const hideOutdated =
    !!question.allowOutdatedFiles && question.showOutdatedFiles === false;
  return hideOutdated ? value.filter((file) => !isOutdatedFile(file)) : value;
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
  const displayed = getDisplayedFiles(question);
  const file = displayed.length === 1 ? displayed[0] : null;
  const kind = file ? getPreviewKind(file.name, file.type ?? '') : null;
  // previewValue holds the downloaded file content (data / http URL), already
  // resolved by the survey's onDownloadFile handler for stored files, in the
  // order of the question value.
  const preview = file
    ? question.previewValue?.[(question.value as File[]).indexOf(file)]
    : null;
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
 * Marks the file at the given index as outdated, or back as active when it
 * already is. The question value is replaced ( not mutated ) so SurveyJS
 * detects the change and notifies the survey.
 *
 * @param question File question instance
 * @param index Index of the file in the question value
 */
const toggleOutdatedFile = (question: QuestionFile, index: number): void => {
  const value: File[] = Array.isArray(question.value) ? question.value : [];
  const target = value[index];
  if (!target) return;
  const updated: File = isOutdatedFile(target)
    ? (omit(target, ['outdated', 'outdatedAt']) as File)
    : { ...target, outdated: true, outdatedAt: new Date().toISOString() };
  question.value = value.map((file, i) => (i === index ? updated : file));
};

/**
 * Permanently removes the file at the given index, through SurveyJS's own
 * removal flow ( confirmation, onClearFiles, value update ).
 *
 * @param question File question instance
 * @param index Index of the file in the question value
 */
const removeFilePermanently = (question: QuestionFile, index: number): void => {
  const target = Array.isArray(question.value) ? question.value[index] : null;
  if (target) question.doRemoveFile(target);
};

/**
 * Keeps the warning icon next to the file name in sync with the outdated
 * state of the file.
 *
 * @param preview Rendered preview item of the file
 * @param outdated Whether the file is outdated
 * @param translate Translate service
 */
const syncOutdatedIcon = (
  preview: HTMLElement,
  outdated: boolean,
  translate: TranslateService
): void => {
  const existing = preview.querySelector(`.${OUTDATED_ICON_CLASS}`);
  const sign = preview.querySelector('.sd-file__sign') as HTMLElement | null;
  if (!outdated || !sign) {
    existing?.remove();
    return;
  }
  if (existing) return;
  const icon = document.createElement('span');
  icon.className = `${OUTDATED_ICON_CLASS} material-icons`;
  icon.textContent = 'warning';
  icon.title = translate.instant('components.form.file.outdated.tooltip');
  sign.insertBefore(icon, sign.firstChild);
};

/**
 * Removes the injected per-file actions, destroying their components.
 *
 * @param question File question instance
 * @param domService Shared DOM service
 * @param keep Indexes of the actions to keep
 */
const removeFileItemActions = (
  question: FilePreviewQuestion,
  domService: DomService,
  keep: Set<number> = new Set()
): void => {
  question.__fileItemActions?.forEach((ref, index) => {
    if (keep.has(index)) return;
    domService.removeComponentFromBody(ref);
    question.__fileItemActions?.delete(index);
  });
};

/**
 * Whether the question shows its only file as a full-size in-area image
 * preview. SurveyJS only does so for single-file questions: the widget
 * extends it to multiple-file questions holding a single image.
 *
 * @param question File question instance
 * @param value Question value
 * @returns True when the single image preview applies
 */
const isSingleImagePreview = (question: QuestionFile, value: File[]): boolean =>
  value.length === 1 && !!question.canPreviewImage(value[0]);

/**
 * Keeps the per-file toolbars of the question in sync with its value and
 * rendering, replacing SurveyJS's own per-file remove button:
 * - warning icon on outdated files,
 * - download action on image previews,
 * - mark as outdated / active on stored files, when the question allows
 *   outdated files, along with a permanent removal instead of the plain one,
 * - outdated files hidden when the question is configured so.
 *
 * Safe to call repeatedly ( it is driven by a MutationObserver ): injected
 * components are reused while SurveyJS keeps the same preview item,
 * re-created when it is re-rendered, and removed once no longer needed.
 *
 * @param question File question instance
 * @param htmlElement The question's rendered root HTML element
 * @param domService Shared DOM service
 * @param translate Translate service
 */
const updateFileItems = (
  question: FilePreviewQuestion,
  htmlElement: HTMLElement,
  domService: DomService,
  translate: TranslateService
): void => {
  const value: File[] = Array.isArray(question.value) ? question.value : [];
  const displayed = getDisplayedFiles(question);
  const allowOutdated = !!question.allowOutdatedFiles;
  const readOnly = question.isReadOnly;
  const singleImage = isSingleImagePreview(question, displayed);
  // Set by updatePdfPreview, which runs first
  const pdfPreview = htmlElement.classList.contains(PDF_PREVIEW_CLASS);
  htmlElement.classList.toggle(LIST_LAYOUT_CLASS, !singleImage && !pdfPreview);
  const previews = Array.from(
    htmlElement.querySelectorAll('.sd-file__preview')
  ) as HTMLElement[];
  const actions =
    question.__fileItemActions ?? (question.__fileItemActions = new Map());
  const keep = new Set<number>();

  previews.forEach((preview, index) => {
    const file = value[index];
    if (!file) return;
    const outdated = isOutdatedFile(file);
    const permanentRemoval = allowOutdated && isStoredFile(file);
    // Hidden outdated file: nothing rendered for it ( no toolbar either )
    const hidden = !displayed.includes(file);
    preview.classList.toggle(OUTDATED_HIDDEN_CLASS, hidden);
    if (hidden) return;
    syncOutdatedIcon(preview, outdated, translate);
    // The toolbar overlays the preview item, except over the PDF preview
    // where it sits next to the "Select file" action, in the upload area.
    const host = (
      pdfPreview
        ? htmlElement.querySelector('.sd-file__wrapper')
        : preview.querySelector('.sd-file__image-wrapper')
    ) as HTMLElement | null;
    // Slot not rendered yet; the observer will call us again once it is.
    if (!host) return;

    let ref = actions.get(index);
    // SurveyJS re-rendered the slot, or the toolbar moved: the previous
    // component is orphaned
    if (ref && !host.contains(ref.location.nativeElement)) {
      domService.removeComponentFromBody(ref);
      ref = undefined;
    }
    if (!ref) {
      ref = domService.appendComponentToBody(
        FileItemActionsComponent,
        host
      ) as ComponentRef<FileItemActionsComponent>;
      actions.set(index, ref);
    }
    const instance = ref.instance;
    instance.file = file;
    instance.outdated = outdated;
    instance.canDownload = singleImage;
    instance.canOutdate = !readOnly && permanentRemoval;
    instance.permanentRemoval = permanentRemoval;
    // Removing a stored file is a per-field role permission, whether or not
    // the question allows outdated files. Files not saved yet can always be
    // removed.
    instance.canRemove =
      !readOnly && (!isStoredFile(file) || question.canDeleteFiles !== false);
    instance.toggleOutdated = () => toggleOutdatedFile(question, index);
    instance.removeFile = () => removeFilePermanently(question, index);
    ref.changeDetectorRef.detectChanges();
    keep.add(index);
  });
  removeFileItemActions(question, domService, keep);
};

/**
 * Keeps the question-level toolbar ( "Select file" action replacing SurveyJS's
 * choose / clear buttons ) and the upload lock in sync with the question:
 * a stored single file can only be replaced by deleting it, so uploads are
 * locked ( action disabled, drops ignored ) until it is removed permanently.
 *
 * @param question File question instance
 * @param htmlElement The question's rendered root HTML element
 * @param domService Shared DOM service
 */
const updateQuestionActions = (
  question: FilePreviewQuestion,
  htmlElement: HTMLElement,
  domService: DomService
): void => {
  const value: File[] = Array.isArray(question.value) ? question.value : [];
  const displayed = getDisplayedFiles(question);
  const readOnly = question.isReadOnly;
  htmlElement.classList.toggle(ANSWERED_CLASS, displayed.length > 0);

  // Extend SurveyJS's single image preview to multiple-file questions holding
  // a single displayed image
  if (question.allowMultiple) {
    htmlElement
      .querySelector('.sd-file')
      ?.classList.toggle(
        SINGLE_IMAGE_CLASS,
        isSingleImagePreview(question, displayed)
      );
  }

  const locked =
    !!question.allowOutdatedFiles &&
    !question.allowMultiple &&
    !readOnly &&
    value.some((file) => isStoredFile(file));
  htmlElement.classList.toggle(SINGLE_LOCKED_CLASS, locked);
  if (locked && !question.__dropBlocker) {
    const blocker = (event: Event): void => {
      event.preventDefault();
      event.stopPropagation();
    };
    htmlElement.addEventListener('drop', blocker, true);
    question.__dropBlocker = blocker;
  } else if (!locked && question.__dropBlocker) {
    htmlElement.removeEventListener('drop', question.__dropBlocker, true);
    question.__dropBlocker = undefined;
  }

  const wrapper = htmlElement.querySelector(
    '.sd-file__wrapper'
  ) as HTMLElement | null;
  let ref = question.__questionActions;
  if (
    ref &&
    (readOnly || !wrapper || !wrapper.contains(ref.location.nativeElement))
  ) {
    domService.removeComponentFromBody(ref);
    ref = undefined;
    question.__questionActions = undefined;
  }
  // Upload area not rendered yet; the observer will call us again once it is.
  if (readOnly || !wrapper) return;
  if (!ref) {
    ref = domService.appendComponentToBody(
      FileQuestionActionsComponent,
      wrapper
    ) as ComponentRef<FileQuestionActionsComponent>;
    question.__questionActions = ref;
  }
  const limit = question.allowMultiple
    ? Number(question.getPropertyValue('allowedFileNumber')) || undefined
    : undefined;
  ref.instance.locked = locked;
  ref.instance.limit = limit;
  ref.instance.limitReached = !!limit && value.length >= limit;
  // Hidden outdated files still count toward the limit: explained in tooltips
  ref.instance.hiddenCount = value.length - displayed.length;
  ref.instance.selectFile = () => {
    const input = htmlElement.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement | null;
    input?.click();
  };
  ref.changeDetectorRef.detectChanges();
};

/**
 * Removes the question-level toolbar and the upload lock, destroying the
 * injected component.
 *
 * @param question File question instance
 * @param domService Shared DOM service
 */
const removeQuestionActions = (
  question: FilePreviewQuestion,
  domService: DomService
): void => {
  if (question.__questionActions) {
    domService.removeComponentFromBody(question.__questionActions);
    question.__questionActions = undefined;
  }
  if (question.__filePreviewElement && question.__dropBlocker) {
    question.__filePreviewElement.removeEventListener(
      'drop',
      question.__dropBlocker,
      true
    );
  }
  question.__dropBlocker = undefined;
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
  const translate = injector.get(TranslateService);
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

      // Render the PDF preview and the toolbars inside the upload area, and
      // keep them in sync with SurveyJS re-renders (value changes, async
      // preview loading).
      filePreviewQuestion.__pdfPreviewObserver?.disconnect();
      const sync = (): void => {
        updatePdfPreview(question, htmlElement);
        updateFileItems(
          filePreviewQuestion,
          htmlElement,
          domService,
          translate
        );
        updateQuestionActions(filePreviewQuestion, htmlElement, domService);
      };
      const observer = new MutationObserver(sync);
      observer.observe(htmlElement, { childList: true, subtree: true });
      filePreviewQuestion.__pdfPreviewObserver = observer;
      sync();
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
      removeFileItemActions(filePreviewQuestion, domService);
      removeQuestionActions(filePreviewQuestion, domService);
      filePreviewQuestion.__fileItemActions = undefined;
      filePreviewQuestion.__pdfPreviewObserver = undefined;
      filePreviewQuestion.__filePreviewElement = undefined;
      filePreviewQuestion.__survey = undefined;
      filePreviewQuestion.__valueChangedHandler = undefined;
    },
  };

  customWidgetCollectionInstance.addCustomWidget(widget, 'customwidget');
};
