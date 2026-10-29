import { DialogRef } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SelectEvent } from '@progress/kendo-angular-upload';
import { QuestionFileModel, SurveyModel } from 'survey-core';
import {
  FileTranslationDialogData,
  FileTranslationModalComponent,
} from './file-translation-modal.component';

describe('FileTranslationModalComponent', () => {
  let question: QuestionFileModel;
  let dialogRef: { close: jest.Mock };
  let data: FileTranslationDialogData;

  /** Translate service surface used by the modal */
  const translate = {
    instant: (key: string, params?: Record<string, unknown>) =>
      params?.['name'] ? `${key}:${params['name']}` : key,
  } as unknown as TranslateService;

  /**
   * Builds a Kendo select event for a picked file.
   *
   * @param file Picked file
   * @param validationErrors Errors raised by the Kendo file select
   * @returns Select event
   */
  const createSelectEvent = (
    file: File,
    validationErrors: string[] = []
  ): SelectEvent =>
    ({
      files: [{ name: file.name, rawFile: file, validationErrors }],
      preventDefault: jest.fn(),
      isDefaultPrevented: () => false,
    } as unknown as SelectEvent);

  /**
   * Builds the modal.
   *
   * @returns Modal component
   */
  const createComponent = (): FileTranslationModalComponent =>
    new FileTranslationModalComponent(
      data,
      dialogRef as unknown as DialogRef<any>,
      translate
    );

  beforeEach(() => {
    const survey = new SurveyModel({
      elements: [
        {
          type: 'file',
          name: 'attachments',
          allowMultiple: true,
          acceptedTypes: '.pdf',
          maxSize: 1000,
        },
      ],
    });
    question = survey.getQuestionByName('attachments') as QuestionFileModel;
    dialogRef = { close: jest.fn() };
    data = {
      file: { name: 'a.pdf', content: 'id-a', lang: 'en' },
      question,
      languages: [
        { value: 'fr', text: 'French' },
        { value: 'es', text: 'Spanish' },
      ],
      existingCount: 1,
    };
  });

  it('preselects the first language and applies the file question restrictions', () => {
    const component = createComponent();
    expect(component.languageControl.value).toBe('fr');
    expect(component.restrictions).toEqual({
      allowedExtensions: ['pdf'],
      maxFileSize: 1000,
    });
    expect(component.accept).toBe('.pdf');
  });

  it('keeps a valid file and closes with it', () => {
    const component = createComponent();
    const picked = new File(['x'], 'a-fr.pdf', { type: 'application/pdf' });
    const event = createSelectEvent(picked);

    component.onSelect(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(component.file).toBe(picked);
    expect(component.errorMessage).toBe('');

    component.languageControl.setValue('es');
    component.onConfirm();
    expect(dialogRef.close).toHaveBeenCalledWith({
      language: 'es',
      file: picked,
    });
  });

  it('rejects a file flagged by the Kendo file select', () => {
    const component = createComponent();
    const event = createSelectEvent(
      new File(['x'], 'a-fr.png', { type: 'image/png' }),
      ['invalidFileExtension']
    );

    component.onSelect(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.file).toBeUndefined();
    expect(component.errorMessage).toBe(
      'components.filesUpload.errors.invalidType:a-fr.png'
    );
  });

  it('rejects a file exceeding the number of files of the question', () => {
    question.allowMultiple = false;
    const component = createComponent();
    const event = createSelectEvent(
      new File(['x'], 'a-fr.pdf', { type: 'application/pdf' })
    );

    component.onSelect(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.errorMessage).toBe(
      'components.filesUpload.errors.singleFileOnly'
    );
  });

  it('forgets a removed file and does not close without one', () => {
    const component = createComponent();
    component.onSelect(
      createSelectEvent(
        new File(['x'], 'a-fr.pdf', { type: 'application/pdf' })
      )
    );
    component.onRemove();
    expect(component.file).toBeUndefined();

    component.onConfirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
