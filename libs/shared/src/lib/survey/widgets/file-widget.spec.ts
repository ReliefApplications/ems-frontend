import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CustomWidgetCollection, SurveyModel } from 'survey-core';
import { DocumentManagementService } from '../../services/document-management/document-management.service';
import { FileService } from '../../services/file/file.service';
import { QuestionFile } from '../types';
import { init } from './file-widget';

/** Minimal custom widget contract exercised by this test. */
interface FileWidget {
  afterRender(question: QuestionFile, htmlElement: HTMLElement): void;
  willUnmount(question: QuestionFile): void;
}

describe('file widget', () => {
  let widget: FileWidget;
  let fileService: Pick<FileService, 'download'>;

  beforeEach(() => {
    fileService = { download: jest.fn() };
    const documentManagementService = {};
    const translateService = { instant: jest.fn().mockReturnValue('Download') };
    const injector = {
      get: (token: unknown): unknown => {
        if (token === DocumentManagementService)
          return documentManagementService;
        if (token === FileService) return fileService;
        if (token === TranslateService) return translateService;
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
    value: Array<{ name: string; type: string; content: string }>
  ): QuestionFile =>
    ({
      value,
      survey: {
        mode,
        onValueChanged: { add: jest.fn(), remove: jest.fn() },
        runExpression: jest.fn(),
      },
      canPreviewImage: jest.fn().mockReturnValue(true),
      allowImagesPreview: true,
    } as unknown as QuestionFile);

  const createElement = (): HTMLElement => {
    const element = document.createElement('div');
    element.innerHTML = '<div class="sd-file__image-wrapper"></div>';
    document.body.appendChild(element);
    return element;
  };

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('downloads a single image from display mode', () => {
    const file = {
      name: 'identity-document.png',
      type: 'image/png',
      content: 'stored-file-id',
    };
    const question = createQuestion('display', [file]);
    const element = createElement();

    widget.afterRender(question, element);
    const button = element.querySelector<HTMLButtonElement>(
      '.file-image-preview__download'
    );
    button?.click();

    expect(button?.getAttribute('aria-label')).toBe(
      'Download: identity-document.png'
    );
    expect(fileService.download).toHaveBeenCalledWith(file);
  });

  it('removes the image action when the widget unmounts', () => {
    const question = createQuestion('display', [
      {
        name: 'identity-document.png',
        type: 'image/png',
        content: 'stored-file-id',
      },
    ]);
    const element = createElement();

    widget.afterRender(question, element);
    widget.willUnmount(question);

    expect(element.querySelector('.file-image-preview__download')).toBeNull();
    expect(element.classList.contains('file-image-preview')).toBe(false);
    expect(
      (question.survey as SurveyModel).onValueChanged.remove
    ).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['edit mode', 'edit', 'image/png'],
    ['a PDF', 'display', 'application/pdf'],
  ] as const)(
    'does not add the image download action for %s',
    (_case, mode, type) => {
      const question = createQuestion(mode, [
        { name: 'identity-document', type, content: 'stored-file-id' },
      ]);
      const element = createElement();

      widget.afterRender(question, element);

      expect(element.querySelector('.file-image-preview__download')).toBeNull();
    }
  );
});
