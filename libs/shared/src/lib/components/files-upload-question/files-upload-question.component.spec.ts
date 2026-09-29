import { ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FileInfo, SelectEvent } from '@progress/kendo-angular-upload';
import { QuestionFileModel, SurveyModel } from 'survey-core';
import { FilesUploadQuestion } from '../../survey/components/files-upload';
import { FilesUploadQuestionComponent } from './files-upload-question.component';

describe('FilesUploadQuestionComponent', () => {
  let survey: SurveyModel;
  let uploadHandler: jest.Mock;
  let component: FilesUploadQuestionComponent;
  let cdr: { detectChanges: jest.Mock };

  /** Stored file of the attachments question */
  const stored = { name: 'stored.png', type: 'image/png', content: 'file-id' };

  /**
   * Builds a fake files upload question exposing its properties.
   *
   * @param properties Question properties
   * @returns Fake question
   */
  const createQuestion = (
    properties: Record<string, unknown> = {}
  ): FilesUploadQuestion =>
    ({
      isReadOnly: false,
      getPropertyValue: (name: string) => properties[name],
    } as unknown as FilesUploadQuestion);

  /**
   * Builds a Kendo select event.
   *
   * @param files Picked files
   * @param validationErrors Kendo validation errors of every file
   * @returns Select event
   */
  const createSelectEvent = (
    files: File[],
    validationErrors?: string[]
  ): SelectEvent =>
    ({
      files: files.map(
        (file, index): FileInfo => ({
          name: file.name,
          rawFile: file,
          uid: `${index}`,
          validationErrors,
        })
      ),
      preventDefault: jest.fn(),
    } as unknown as SelectEvent);

  /**
   * Builds a native file.
   *
   * @param name File name
   * @param type Mime type
   * @returns File
   */
  const createFile = (name: string, type = 'image/png'): File =>
    new File(['x'], name, { type });

  beforeEach(() => {
    survey = new SurveyModel({
      title: { default: 'Files', fr: 'Fichiers' },
      elements: [
        {
          type: 'file',
          name: 'attachments',
          title: 'Attachments',
          allowMultiple: true,
          acceptedTypes: 'image/*',
        },
        { type: 'file', name: 'cover', title: 'Cover', acceptedTypes: '.png' },
      ],
    });
    // App-registered property, not part of the bare survey model
    survey
      .getQuestionByName('attachments')
      .setPropertyValue('allowedFileNumber', 2);
    survey.setValue('attachments', [stored]);
    // Same contract as FormBuilderService.onUploadFiles: files are read and
    // handed back to the callback
    uploadHandler = jest.fn((_, options) =>
      options.callback(
        'success',
        options.files.map((file: File) => ({
          file,
          content: `data:${file.name}`,
        }))
      )
    );
    survey.onUploadFiles.add(uploadHandler);
    cdr = { detectChanges: jest.fn() };
    component = new FilesUploadQuestionComponent(
      {
        instant: (key: string, params?: Record<string, unknown>) =>
          params ? `${key}:${JSON.stringify(params)}` : key,
        currentLang: 'en',
        defaultLang: 'en',
      } as unknown as TranslateService,
      cdr as unknown as ChangeDetectorRef,
      { availableLanguages: ['en', 'fr'] }
    );
    component.survey = survey;
    component.question = createQuestion({
      targetField: 'cover',
      defaultLanguage: 'fr',
    });
    component.ngOnInit();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('preselects the configured document type and language, and reads the target restrictions', () => {
    component.refresh();

    expect(component.targetFieldChoices).toEqual([
      { value: 'attachments', text: 'Attachments' },
      { value: 'cover', text: 'Cover' },
    ]);
    expect(component.languageChoices.map((c) => c.value)).toEqual(['en', 'fr']);
    expect(component.targetFieldControl.value).toBe('cover');
    expect(component.languageControl.value).toBe('fr');
    expect(component.multiple).toBe(false);
    expect(component.accept).toBe('.png');
    expect(component.restrictions).toEqual({ allowedExtensions: ['png'] });
    expect(component.disabled).toBe(false);
  });

  it('falls back to the first choices when the configured ones do not exist', () => {
    component.question = createQuestion({
      targetField: 'removed',
      defaultLanguage: 'de',
    });
    component.refresh();

    expect(component.targetFieldControl.value).toBe('attachments');
    expect(component.languageControl.value).toBe('en');
    expect(component.multiple).toBe(true);
  });

  it('keeps the user selections across refreshes', () => {
    component.refresh();
    component.targetFieldControl.setValue('attachments');
    component.languageControl.setValue('en');

    component.refresh();
    expect(component.targetFieldControl.value).toBe('attachments');
    expect(component.languageControl.value).toBe('en');
  });

  it('is disabled in the form builder and in read-only surveys', () => {
    survey.setDesignMode(true);
    component.refresh();
    expect(component.disabled).toBe(true);
    expect(component.targetFieldControl.disabled).toBe(true);

    survey.setDesignMode(false);
    survey.mode = 'display';
    component.refresh();
    expect(component.disabled).toBe(true);

    survey.mode = 'edit';
    component.refresh();
    expect(component.disabled).toBe(false);
    expect(component.targetFieldControl.disabled).toBe(false);
  });

  it('adds picked files to the target question, tagged with the language', () => {
    component.refresh();
    component.targetFieldControl.setValue('attachments');
    component.errorMessage = 'previous error';
    const event = createSelectEvent([createFile('new.png')]);

    component.onSelect(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(uploadHandler).toHaveBeenCalledTimes(1);
    expect(uploadHandler.mock.calls[0][1].name).toBe('attachments');
    expect(survey.getValue('attachments')).toEqual([
      stored,
      {
        name: 'new.png',
        type: 'image/png',
        content: 'data:new.png',
        lang: 'fr',
      },
    ]);
    expect(component.errorMessage).toBe('');
    expect(cdr.detectChanges).toHaveBeenCalled();
  });

  it('rejects a whole pick exceeding the allowed number of files, keeping the existing ones', () => {
    component.refresh();
    component.targetFieldControl.setValue('attachments');

    component.onSelect(
      createSelectEvent([createFile('a.png'), createFile('b.png')])
    );

    expect(uploadHandler).not.toHaveBeenCalled();
    expect(survey.getValue('attachments')).toEqual([stored]);
    expect(component.errorMessage).toBe(
      'components.filesUpload.errors.maximumAllowedFiles:{"number":2}'
    );
  });

  it('rejects a second file on a single-file question', () => {
    component.refresh();
    survey.setValue('cover', [stored]);

    component.onSelect(createSelectEvent([createFile('a.png')]));

    expect(uploadHandler).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe(
      'components.filesUpload.errors.singleFileOnly'
    );
  });

  it('rejects files flagged by the Kendo restrictions, naming the file', () => {
    component.refresh();

    component.onSelect(
      createSelectEvent([createFile('a.gif')], ['invalidFileExtension'])
    );
    expect(component.errorMessage).toBe(
      'components.filesUpload.errors.invalidType:{"name":"a.gif"}'
    );

    component.onSelect(
      createSelectEvent([createFile('big.png')], ['invalidMaxFileSize'])
    );
    expect(component.errorMessage).toBe(
      'components.filesUpload.errors.maxSizeExceeded:{"name":"big.png"}'
    );
    expect(uploadHandler).not.toHaveBeenCalled();
  });

  it('rejects mime types the target question does not accept', () => {
    component.refresh();
    component.targetFieldControl.setValue('attachments');
    survey.setValue('attachments', []);

    component.onSelect(
      createSelectEvent([createFile('notes.txt', 'text/plain')])
    );

    expect(uploadHandler).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe(
      'components.filesUpload.errors.invalidType:{"name":"notes.txt"}'
    );
  });

  it('asks for a document type when none is selected', () => {
    component.refresh();
    component.targetFieldControl.setValue(null);

    component.onSelect(createSelectEvent([createFile('a.png')]));

    expect(component.errorMessage).toBe(
      'components.filesUpload.errors.noTargetField'
    );
  });

  it('reports a failed file reading', () => {
    survey.onUploadFiles.remove(uploadHandler);
    survey.onUploadFiles.add((_, options) => options.callback('error'));
    component.refresh();

    component.onSelect(createSelectEvent([createFile('a.png')]));

    expect(survey.getValue('cover')).toBeUndefined();
    expect(component.errorMessage).toBe(
      'components.filesUpload.errors.uploadFailed'
    );
  });

  it('clears the error when the document type changes', () => {
    component.refresh();
    component.errorMessage = 'error';

    component.targetFieldControl.setValue('attachments');

    expect(component.errorMessage).toBe('');
    expect(component.multiple).toBe(true);
  });

  it('ignores picks while disabled', () => {
    survey.setDesignMode(true);
    component.refresh();

    component.onSelect(createSelectEvent([createFile('a.png')]));

    expect(uploadHandler).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('');
  });

  it('lists every file of the survey waiting to be uploaded, with its document type', () => {
    survey.setValue('attachments', [
      stored,
      { name: 'b.png', content: 'data:b', lang: 'fr' },
    ]);
    survey.setValue('cover', [{ name: 'a.png', content: 'data:a' }]);
    component.refresh();

    expect(
      component.rows.map((row) => [
        row.file.name,
        row.fieldTitle,
        row.languageLabel,
        row.canRemove,
      ])
    ).toEqual([
      ['b.png', 'Attachments', 'French', true],
      ['a.png', 'Cover', '', true],
    ]);
    expect(component.rows[0].icon).toBe('k-i-file-image');

    component.onSortChange([{ field: 'file.name', dir: 'asc' }]);
    expect(component.rows.map((row) => row.file.name)).toEqual([
      'a.png',
      'b.png',
    ]);
  });

  it('removes a file to upload through the file question itself', () => {
    const file = { name: 'a.png', content: 'data:a' };
    survey.setValue('cover', [file]);
    const cover = survey.getQuestionByName('cover') as QuestionFileModel;
    const doRemoveFile = jest
      .spyOn(cover, 'doRemoveFile')
      .mockImplementation(() => undefined);
    component.refresh();

    component.rows.find((row) => row.file.name === 'a.png')?.removeFile();

    expect(doRemoveFile).toHaveBeenCalledWith(file);
  });

  it('cannot remove files to upload in read-only surveys', () => {
    survey.setValue('cover', [{ name: 'a.png', content: 'data:a' }]);
    survey.mode = 'display';
    component.refresh();

    expect(component.rows[0].canRemove).toBe(false);
  });
});
