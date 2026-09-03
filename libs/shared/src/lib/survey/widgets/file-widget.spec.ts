import { ComponentRef, Injector } from '@angular/core';
import { CustomWidgetCollection, SurveyModel } from 'survey-core';
import { DocumentManagementService } from '../../services/document-management/document-management.service';
import { DomService } from '../../services/dom/dom.service';
import { FileDownloadButtonComponent } from '../components/file-download-button/public-api';
import { QuestionFile } from '../types';
import { init } from './file-widget';

/** Minimal custom widget contract exercised by this test. */
interface FileWidget {
  afterRender(question: QuestionFile, htmlElement: HTMLElement): void;
  willUnmount(question: QuestionFile): void;
}

/** Component reference shape used by the widget. */
type ButtonRef = Pick<
  ComponentRef<FileDownloadButtonComponent>,
  'instance' | 'location' | 'changeDetectorRef'
>;

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

  beforeEach(() => {
    domService = {
      appendComponentToBody: jest.fn(
        (component: unknown, parent: HTMLElement): ButtonRef => {
          const nativeElement = document.createElement(
            'shared-file-download-button'
          );
          parent.appendChild(nativeElement);
          return {
            instance: {} as FileDownloadButtonComponent,
            location: { nativeElement },
            changeDetectorRef: { detectChanges: jest.fn() } as any,
          };
        }
      ) as any,
      removeComponentFromBody: jest.fn((ref: ButtonRef) =>
        ref.location.nativeElement.remove()
      ),
    };
    const injector = {
      get: (token: unknown): unknown => {
        if (token === DocumentManagementService) return {};
        if (token === DomService) return domService;
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

  const getButton = (): ButtonRef =>
    (domService.appendComponentToBody as jest.Mock).mock.results[0].value;

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it.each([
    ['display mode', 'display', image],
    [
      'edit mode, for a freshly picked file',
      'edit',
      { ...image, content: 'data:image/png;base64,AAAA' },
    ],
  ] as const)('injects a download button in %s', (_case, mode, file) => {
    const question = createQuestion(mode, [file]);
    const element = createElement();

    widget.afterRender(question, element);

    expect(domService.appendComponentToBody).toHaveBeenCalledWith(
      FileDownloadButtonComponent,
      element.querySelector('.sd-file__image-wrapper')
    );
    expect(getButton().instance.file).toBe(file);
    expect(getButton().changeDetectorRef.detectChanges).toHaveBeenCalled();
  });

  it('reuses the button and updates its file on re-render', () => {
    const question = createQuestion('edit', [image]);
    const element = createElement();
    const replacement = { ...image, name: 'other.png' };

    widget.afterRender(question, element);
    question.value = [replacement];
    widget.afterRender(question, element);

    expect(domService.appendComponentToBody).toHaveBeenCalledTimes(1);
    expect(getButton().instance.file).toBe(replacement);
  });

  it('removes the button when the widget unmounts', () => {
    const question = createQuestion('display', [image]);
    const element = createElement();

    widget.afterRender(question, element);
    widget.willUnmount(question);

    expect(domService.removeComponentFromBody).toHaveBeenCalledWith(
      getButton()
    );
    expect(element.querySelector('shared-file-download-button')).toBeNull();
    expect(
      (question.survey as SurveyModel).onValueChanged.remove
    ).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['a PDF', 'display'],
    ['a PDF in edit mode', 'edit'],
  ] as const)('does not inject a download button for %s', (_case, mode) => {
    const question = createQuestion(mode, [
      {
        name: 'identity-document.pdf',
        type: 'application/pdf',
        content: 'stored-file-id',
      },
    ]);
    const element = createElement();

    widget.afterRender(question, element);

    expect(domService.appendComponentToBody).not.toHaveBeenCalled();
  });
});
