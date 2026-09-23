import { ComponentRef, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CustomWidgetCollection, SurveyModel } from 'survey-core';
import { DocumentManagementService } from '../../services/document-management/document-management.service';
import { DomService } from '../../services/dom/dom.service';
import { FileItemActionsComponent } from '../components/file-item-actions/public-api';
import { FileQuestionActionsComponent } from '../components/file-question-actions/public-api';
import { QuestionFile } from '../types';
import { init } from './file-widget';

/** Minimal custom widget contract exercised by this test. */
interface FileWidget {
  afterRender(question: QuestionFile, htmlElement: HTMLElement): void;
  willUnmount(question: QuestionFile): void;
}

/** Component reference shape used by the widget. */
type Ref<T> = Pick<
  ComponentRef<T>,
  'instance' | 'location' | 'changeDetectorRef'
>;

/** Selectors of the components injected by the widget. */
const SELECTORS = new Map<unknown, string>([
  [FileItemActionsComponent, 'shared-file-item-actions'],
  [FileQuestionActionsComponent, 'shared-file-question-actions'],
]);

describe('file widget', () => {
  let widget: FileWidget;
  let domService: Pick<
    DomService,
    'appendComponentToBody' | 'removeComponentFromBody'
  >;
  const image = {
    name: 'identity-document.png',
    type: 'image/png',
    content: 'stored-file-id',
  };
  const stored = {
    name: 'report.docx',
    type: 'application/octet-stream',
    content: { driveId: 'drive', itemId: 'item' },
  } as any;

  beforeEach(() => {
    domService = {
      appendComponentToBody: jest.fn(
        (component: unknown, parent: HTMLElement): Ref<unknown> => {
          const nativeElement = document.createElement(
            SELECTORS.get(component) ?? 'unknown'
          );
          parent.appendChild(nativeElement);
          return {
            instance: {},
            location: { nativeElement },
            changeDetectorRef: { detectChanges: jest.fn() } as any,
          };
        }
      ) as any,
      removeComponentFromBody: jest.fn((ref: Ref<unknown>) =>
        ref.location.nativeElement.remove()
      ),
    };
    const injector = {
      get: (token: unknown): unknown => {
        if (token === DocumentManagementService) return {};
        if (token === DomService) return domService;
        if (token === TranslateService)
          return { instant: (key: string) => key };
        throw new Error('Unexpected injection token');
      },
    } as Injector;
    const collection = {
      addCustomWidget: (registeredWidget: FileWidget): void => {
        widget = registeredWidget;
      },
    } as unknown as CustomWidgetCollection;

    init(injector, collection);
  });

  const createQuestion = (
    mode: 'display' | 'edit',
    value: Array<{
      name: string;
      type: string;
      content: unknown;
      outdated?: boolean;
    }>,
    properties: Partial<QuestionFile> = {}
  ): QuestionFile =>
    ({
      value,
      survey: {
        mode,
        onValueChanged: { add: jest.fn(), remove: jest.fn() },
        runExpression: jest.fn(),
      },
      isReadOnly: mode === 'display',
      allowMultiple: false,
      canPreviewImage: jest.fn(
        (file: { type?: string }) => !!file?.type?.startsWith('image/')
      ),
      allowImagesPreview: true,
      doRemoveFile: jest.fn(),
      getPropertyValue: () => undefined,
      ...properties,
    } as unknown as QuestionFile);

  const createElement = (files = 1): HTMLElement => {
    const element = document.createElement('div');
    element.innerHTML =
      '<div class="sd-file">' +
      '<input type="file" />' +
      '<div class="sd-file__wrapper"></div>' +
      Array.from({ length: files })
        .map(
          () =>
            '<span class="sd-file__preview">' +
            '<div class="sd-file__image-wrapper"></div>' +
            '<div class="sd-file__sign"><a>file</a></div>' +
            '</span>'
        )
        .join('') +
      '</div>';
    document.body.appendChild(element);
    return element;
  };

  const getInjected = <T>(component: unknown): Ref<T>[] =>
    (domService.appendComponentToBody as jest.Mock).mock.calls
      .map((call, index) => ({
        call,
        ref: (domService.appendComponentToBody as jest.Mock).mock.results[index]
          .value,
      }))
      .filter(({ call }) => call[0] === component)
      .map(({ ref }) => ref);

  const getItems = (): Ref<FileItemActionsComponent>[] =>
    getInjected(FileItemActionsComponent);

  const getQuestionActions = (): Ref<FileQuestionActionsComponent>[] =>
    getInjected(FileQuestionActionsComponent);

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('per-file toolbar', () => {
    it('injects a toolbar in each preview item', () => {
      const question = createQuestion('edit', [stored, image], {
        allowMultiple: true,
      });
      const element = createElement(2);

      widget.afterRender(question, element);

      const wrappers = element.querySelectorAll('.sd-file__image-wrapper');
      expect(domService.appendComponentToBody).toHaveBeenCalledWith(
        FileItemActionsComponent,
        wrappers[0]
      );
      expect(domService.appendComponentToBody).toHaveBeenCalledWith(
        FileItemActionsComponent,
        wrappers[1]
      );
      expect(getItems()[0].instance.file).toBe(stored);
      expect(getItems()[1].instance.file).toBe(image);
      expect(getItems()[0].changeDetectorRef.detectChanges).toHaveBeenCalled();
    });

    it.each([
      ['display mode', 'display', image],
      [
        'edit mode, for a freshly picked file',
        'edit',
        { ...image, content: 'data:image/png;base64,AAAA' },
      ],
    ] as const)(
      'offers the download of a single image in %s',
      (_case, mode, file) => {
        const question = createQuestion(mode, [file]);
        const element = createElement();

        widget.afterRender(question, element);

        expect(getItems()[0].instance.canDownload).toBe(true);
      }
    );

    it.each([
      [
        'a single PDF',
        [{ ...stored, name: 'a.pdf', type: 'application/pdf' }],
        false,
      ],
      ['several images', [image, image], true],
    ] as const)(
      'does not offer the download of %s',
      (_case, value, allowMultiple) => {
        const question = createQuestion('edit', value as any, {
          allowMultiple,
        });
        const element = createElement(value.length);

        widget.afterRender(question, element);

        getItems().forEach((item) =>
          expect(item.instance.canDownload).toBe(false)
        );
      }
    );

    it('reuses the toolbar and updates its file on re-render', () => {
      const question = createQuestion('edit', [image]);
      const element = createElement();
      const replacement = { ...image, name: 'other.png' };

      widget.afterRender(question, element);
      question.value = [replacement];
      widget.afterRender(question, element);

      expect(getItems()).toHaveLength(1);
      expect(getItems()[0].instance.file).toBe(replacement);
    });

    it('offers a plain removal when outdated files are not allowed', () => {
      const question = createQuestion('edit', [stored]);
      const element = createElement();

      widget.afterRender(question, element);

      const { instance } = getItems()[0];
      expect(instance.canRemove).toBe(true);
      expect(instance.permanentRemoval).toBe(false);
      expect(instance.canOutdate).toBe(false);
    });

    it('offers no action in display mode', () => {
      const question = createQuestion(
        'display',
        [{ ...stored, outdated: true }],
        {
          allowOutdatedFiles: true,
        }
      );
      const element = createElement();

      widget.afterRender(question, element);

      const { instance } = getItems()[0];
      expect(instance.outdated).toBe(true);
      expect(instance.canRemove).toBe(false);
      expect(instance.canOutdate).toBe(false);
    });

    it('removes a file through SurveyJS', () => {
      const question = createQuestion('edit', [stored]);
      const element = createElement();
      widget.afterRender(question, element);

      getItems()[0].instance.removeFile();

      expect(question.doRemoveFile).toHaveBeenCalledWith(stored);
    });

    it('removes the toolbars when the widget unmounts', () => {
      const question = createQuestion('edit', [stored]);
      const element = createElement();
      widget.afterRender(question, element);

      widget.willUnmount(question);

      expect(domService.removeComponentFromBody).toHaveBeenCalledWith(
        getItems()[0]
      );
      expect(domService.removeComponentFromBody).toHaveBeenCalledWith(
        getQuestionActions()[0]
      );
      expect(element.querySelector('shared-file-item-actions')).toBeNull();
      expect(element.querySelector('shared-file-question-actions')).toBeNull();
      expect(
        (question.survey as SurveyModel).onValueChanged.remove
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('outdated files', () => {
    it('offers outdating and permanent removal on stored files when allowed', () => {
      const question = createQuestion('edit', [stored], {
        allowOutdatedFiles: true,
      });
      const element = createElement();

      widget.afterRender(question, element);

      const { instance } = getItems()[0];
      expect(instance.canOutdate).toBe(true);
      expect(instance.permanentRemoval).toBe(true);
      expect(instance.canRemove).toBe(true);
      expect(instance.outdated).toBe(false);
    });

    it('hides the permanent removal from roles not allowed to delete files', () => {
      const question = createQuestion(
        'edit',
        [stored, { ...stored, content: 'data:x' }],
        {
          allowOutdatedFiles: true,
          allowMultiple: true,
          canDeleteFiles: false,
        }
      );
      const element = createElement(2);

      widget.afterRender(question, element);

      // Stored file: outdate only
      expect(getItems()[0].instance.canOutdate).toBe(true);
      expect(getItems()[0].instance.canRemove).toBe(false);
      // File not stored yet: plain removal stays
      expect(getItems()[1].instance.canRemove).toBe(true);
      expect(getItems()[1].instance.permanentRemoval).toBe(false);
    });

    it('hides the removal of stored files from roles not allowed to delete files, even without the outdated option', () => {
      const question = createQuestion(
        'edit',
        [stored, { ...stored, content: 'data:x' }],
        { allowMultiple: true, canDeleteFiles: false }
      );
      const element = createElement(2);

      widget.afterRender(question, element);

      expect(getItems()[0].instance.canRemove).toBe(false);
      expect(getItems()[0].instance.canOutdate).toBe(false);
      expect(getItems()[1].instance.canRemove).toBe(true);
    });

    it('keeps the plain removal on files not stored yet', () => {
      const question = createQuestion(
        'edit',
        [{ ...stored, content: 'data:application/pdf;base64,AAAA' }],
        { allowOutdatedFiles: true }
      );
      const element = createElement();

      widget.afterRender(question, element);

      const { instance } = getItems()[0];
      expect(instance.canOutdate).toBe(false);
      expect(instance.permanentRemoval).toBe(false);
      expect(instance.canRemove).toBe(true);
    });

    it('marks a file as outdated, then back as active', () => {
      const question = createQuestion('edit', [stored], {
        allowOutdatedFiles: true,
      });
      const element = createElement();
      widget.afterRender(question, element);

      getItems()[0].instance.toggleOutdated();
      widget.afterRender(question, element);

      expect(question.value[0]).not.toBe(stored);
      expect(question.value[0].outdated).toBe(true);
      expect(typeof question.value[0].outdatedAt).toBe('string');
      expect(getItems()).toHaveLength(1);
      expect(getItems()[0].instance.outdated).toBe(true);
      expect(
        element.querySelector('.sd-file__sign .file-item__outdated-icon')
      ).not.toBeNull();

      getItems()[0].instance.toggleOutdated();
      widget.afterRender(question, element);

      expect(question.value[0]).toEqual(stored);
      expect(getItems()[0].instance.outdated).toBe(false);
      expect(element.querySelector('.file-item__outdated-icon')).toBeNull();
    });

    it('hides outdated files when the question is configured so', () => {
      const question = createQuestion(
        'edit',
        [{ ...stored, outdated: true }, stored],
        {
          allowOutdatedFiles: true,
          showOutdatedFiles: false,
          allowMultiple: true,
        }
      );
      const element = createElement(2);

      widget.afterRender(question, element);

      const previews = element.querySelectorAll('.sd-file__preview');
      expect(previews[0].classList.contains('file-item--hidden')).toBe(true);
      expect(previews[1].classList.contains('file-item--hidden')).toBe(false);
      // No toolbar for the hidden file, the value still holds it
      expect(getItems()).toHaveLength(1);
      expect(getItems()[0].instance.file).toBe(question.value[1]);
      expect(question.value).toHaveLength(2);
    });

    it('renders nothing for a hidden outdated single PDF', () => {
      const pdf = {
        ...stored,
        name: 'report.pdf',
        type: 'application/pdf',
        outdated: true,
      };
      const question = createQuestion('edit', [pdf], {
        allowOutdatedFiles: true,
        showOutdatedFiles: false,
        previewValue: [{ ...pdf, content: 'http://files/report.pdf' }],
      } as any);
      const element = createElement();

      widget.afterRender(question, element);

      expect(element.classList.contains('file-pdf-preview')).toBe(false);
      expect(element.classList.contains('file-question--answered')).toBe(false);
      expect(getItems()).toHaveLength(0);
      expect(
        element
          .querySelector('.sd-file__preview')
          ?.classList.contains('file-item--hidden')
      ).toBe(true);
      // The single file still locks uploads: it must be removed permanently
      expect(getQuestionActions()[0].instance.locked).toBe(true);
    });

    it('does not extend the single image preview to a hidden outdated image', () => {
      const question = createQuestion('edit', [{ ...image, outdated: true }], {
        allowOutdatedFiles: true,
        showOutdatedFiles: false,
        allowMultiple: true,
      });
      const element = createElement();

      widget.afterRender(question, element);

      expect(
        element
          .querySelector('.sd-file')
          ?.classList.contains('sd-file--single-image')
      ).toBe(false);
      expect(getItems()).toHaveLength(0);
    });
  });

  describe('question toolbar', () => {
    it('injects the select action in the upload area, opening the file picker', () => {
      const question = createQuestion('edit', []);
      const element = createElement(0);
      const input = element.querySelector('input') as HTMLInputElement;
      input.click = jest.fn();

      widget.afterRender(question, element);

      expect(domService.appendComponentToBody).toHaveBeenCalledWith(
        FileQuestionActionsComponent,
        element.querySelector('.sd-file__wrapper')
      );
      expect(getQuestionActions()[0].instance.locked).toBe(false);
      expect(element.classList.contains('file-question--answered')).toBe(false);
      getQuestionActions()[0].instance.selectFile();
      expect(input.click).toHaveBeenCalled();
    });

    it('does not inject the select action in display mode', () => {
      const question = createQuestion('display', [stored]);
      const element = createElement();

      widget.afterRender(question, element);

      expect(getQuestionActions()).toHaveLength(0);
    });

    it('flags the question as answered once it holds a file', () => {
      const question = createQuestion('edit', [stored]);
      const element = createElement();

      widget.afterRender(question, element);

      expect(element.classList.contains('file-question--answered')).toBe(true);
    });

    it('locks uploads on a single-file question holding a stored file', () => {
      const question = createQuestion('edit', [stored], {
        allowOutdatedFiles: true,
      });
      const element = createElement();
      widget.afterRender(question, element);

      expect(element.classList.contains('file-single-locked')).toBe(true);
      expect(getQuestionActions()[0].instance.locked).toBe(true);
      const dropHandler = jest.fn();
      const wrapper = element.querySelector(
        '.sd-file__image-wrapper'
      ) as HTMLElement;
      wrapper.addEventListener('drop', dropHandler);
      const drop = new Event('drop', { bubbles: true, cancelable: true });
      wrapper.dispatchEvent(drop);
      expect(dropHandler).not.toHaveBeenCalled();
      expect(drop.defaultPrevented).toBe(true);

      question.value = [];
      widget.afterRender(question, element);
      expect(element.classList.contains('file-single-locked')).toBe(false);
      expect(getQuestionActions()[0].instance.locked).toBe(false);
      wrapper.dispatchEvent(new Event('drop', { bubbles: true }));
      expect(dropHandler).toHaveBeenCalledTimes(1);
    });

    it('tells the user about hidden outdated files and the reached limit', () => {
      const hidden = { ...stored, outdated: true };
      const question = createQuestion('edit', [hidden, stored, stored], {
        allowOutdatedFiles: true,
        showOutdatedFiles: false,
        allowMultiple: true,
        getPropertyValue: (name: string) =>
          name === 'allowedFileNumber' ? 3 : undefined,
      } as any);
      const element = createElement(3);

      widget.afterRender(question, element);

      const { instance } = getQuestionActions()[0];
      expect(instance.hiddenCount).toBe(1);
      expect(instance.limit).toBe(3);
      expect(instance.limitReached).toBe(true);
      expect(instance.locked).toBe(false);

      question.value = [hidden, stored];
      widget.afterRender(question, element);
      expect(getQuestionActions()[0].instance.limitReached).toBe(false);
    });

    it('reports a single hidden outdated file as locking uploads', () => {
      const question = createQuestion('edit', [{ ...stored, outdated: true }], {
        allowOutdatedFiles: true,
        showOutdatedFiles: false,
      });
      const element = createElement();

      widget.afterRender(question, element);

      const { instance } = getQuestionActions()[0];
      expect(instance.locked).toBe(true);
      expect(instance.hiddenCount).toBe(1);
      expect(instance.limitReached).toBe(false);
    });

    it.each([
      [
        'multiple-file questions',
        { allowOutdatedFiles: true, allowMultiple: true },
      ],
      ['questions not allowing outdated files', {}],
    ] as const)('does not lock uploads on %s', (_case, properties) => {
      const question = createQuestion('edit', [stored], properties);
      const element = createElement();

      widget.afterRender(question, element);

      expect(element.classList.contains('file-single-locked')).toBe(false);
      expect(getQuestionActions()[0].instance.locked).toBe(false);
    });
  });

  describe('layout', () => {
    it('flags the plain list layout', () => {
      const question = createQuestion('edit', [stored, stored], {
        allowMultiple: true,
      });
      const element = createElement(2);

      widget.afterRender(question, element);

      expect(element.classList.contains('file-question--list')).toBe(true);
    });

    it('does not flag the plain list layout on a single image', () => {
      const question = createQuestion('edit', [image]);
      const element = createElement();

      widget.afterRender(question, element);

      expect(element.classList.contains('file-question--list')).toBe(false);
    });

    it('moves the toolbar next to the select action over a PDF preview', () => {
      const pdf = { ...stored, name: 'report.pdf', type: 'application/pdf' };
      const question = createQuestion('edit', [pdf], {
        previewValue: [{ ...pdf, content: 'http://files/report.pdf' }],
      } as any);
      const element = createElement();

      widget.afterRender(question, element);

      expect(element.classList.contains('file-pdf-preview')).toBe(true);
      expect(element.classList.contains('file-question--list')).toBe(false);
      expect(getItems()).toHaveLength(1);
      expect(
        element.querySelector('.sd-file__wrapper shared-file-item-actions')
      ).not.toBeNull();
      expect(
        element.querySelector(
          '.sd-file__image-wrapper shared-file-item-actions'
        )
      ).toBeNull();
    });
  });

  describe('single image preview', () => {
    it('extends it to a multiple-file question holding a single image', () => {
      const question = createQuestion('edit', [image], { allowMultiple: true });
      const element = createElement();

      widget.afterRender(question, element);

      expect(
        element
          .querySelector('.sd-file')
          ?.classList.contains('sd-file--single-image')
      ).toBe(true);

      question.value = [image, image];
      widget.afterRender(question, element);
      expect(
        element
          .querySelector('.sd-file')
          ?.classList.contains('sd-file--single-image')
      ).toBe(false);
    });

    it('leaves single-file questions to SurveyJS', () => {
      const question = createQuestion('edit', [image]);
      const element = createElement();

      widget.afterRender(question, element);

      expect(
        element
          .querySelector('.sd-file')
          ?.classList.contains('sd-file--single-image')
      ).toBe(false);
    });
  });
});
