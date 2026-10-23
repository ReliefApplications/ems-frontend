import { TestBed } from '@angular/core/testing';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { of, throwError } from 'rxjs';
import { SurveyModel } from 'survey-core';
import { AuthService } from '../auth/auth.service';
import { ConfirmService } from '../confirm/confirm.service';
import { DocumentManagementService } from '../document-management/document-management.service';
import { DownloadService } from '../download/download.service';
import { FileService } from '../file/file.service';
import { TranslateService } from '@ngx-translate/core';
import { FormHelpersService } from './form-helper.service';

describe('FormHelpersService', () => {
  let service: FormHelpersService;

  const createSurveyMock = (question: unknown, data: Record<string, unknown>) =>
    ({
      data,
      getQuestionByValueName: () => question,
      getQuestionByName: () => question,
      getVariable: () => undefined,
    } as unknown as SurveyModel);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormHelpersService,
        { provide: 'environment', useValue: {} },
        { provide: Apollo, useValue: {} },
        { provide: SnackbarService, useValue: {} },
        { provide: ConfirmService, useValue: {} },
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
        { provide: AuthService, useValue: {} },
        { provide: DownloadService, useValue: {} },
        { provide: DocumentManagementService, useValue: {} },
        { provide: FileService, useValue: {} },
      ],
    });
    service = TestBed.inject(FormHelpersService);
  });

  it('keeps non-file question placeholders untouched', () => {
    const options = {
      name: 'birth_date',
      value: '1986-04-16T18:30:00.000Z',
      isExists: true,
    };
    const survey = createSurveyMock(
      { getType: () => 'text', inputType: 'date' },
      { birth_date: '1986-04-16T18:30:00.000Z' }
    );

    service.onProcessTextValue(survey, options);

    expect(options.value).toBe('1986-04-16T18:30:00.000Z');
    expect(options.isExists).toBe(true);
  });

  it('renders file links, flagging outdated files and keeping their index', () => {
    const files = [
      { name: 'old.pdf', content: 'old-id', outdated: true },
      { name: 'current.docx', content: 'current-id' },
    ];
    const options = { name: 'documents', value: files, isExists: true };
    const survey = createSurveyMock(
      { getType: () => 'file' },
      {
        documents: files,
      }
    );

    service.onProcessTextValue(survey, options);

    const html = options.value as unknown as string;
    expect(html).toContain('index="0" data-outdated="true"');
    expect(html).toContain('index="1" style=');
    expect(html).not.toContain('index="1" data-outdated');
    expect(html.match(/>warning</g)).toHaveLength(1);
    expect(html).toContain('title="current.docx"');
  });

  it.each([
    ['hides', undefined, true],
    ['hides', false, true],
    ['displays', true, false],
  ])(
    '%s outdated files in HTML questions when showOutdatedFiles is %s',
    (_case, showOutdatedFiles, hidden) => {
      const htmlElement = document.createElement('div');
      htmlElement.innerHTML = '<div class="sd-html"></div>';
      const question = {
        getType: () => 'html',
        getPropertyValue: (name: string) =>
          name === 'showOutdatedFiles' ? showOutdatedFiles : undefined,
      } as any;

      service.onAfterRenderQuestion(createSurveyMock(question, {}), {
        question,
        htmlElement,
      });

      expect(
        htmlElement.classList.contains('html-question--hide-outdated-files')
      ).toBe(hidden);
    }
  );

  it('renders nothing for placeholders that point to no field or value', () => {
    const options = { name: 'missing', value: undefined, isExists: false };
    const survey = createSurveyMock(undefined, {});

    service.onProcessTextValue(survey, options);

    expect(options.value).toBe('');
    expect(options.isExists).toBe(true);
  });
});

describe('FormHelpersService files upload', () => {
  let service: FormHelpersService;
  let uploadFile: jest.Mock;
  let updateFile: jest.Mock;
  let uploadBlob: jest.Mock;
  let getFileBlob: jest.Mock;
  let mutate: jest.Mock;
  let openSnackBar: jest.Mock;
  const environment: { csApiUrl?: string } = {};

  const dataUrl = 'data:text/plain;base64,aGVsbG8=';
  const otherDataUrl = 'data:text/plain;base64,d29ybGQ=';
  const objectUrl = 'blob:http://localhost/picked';
  let revokeObjectURL: jest.Mock;
  let openComponentSnackBar: jest.Mock;
  /** Spinner of the last opened progress snackbar, and its messages */
  let spinner: { message: string; loading: boolean; error?: boolean };
  let messages: string[];
  let triggerSnackBar: jest.Mock;
  const stored = { driveId: 'drive', itemId: 'stored-item' };
  const uploaded = { driveId: 'drive', itemId: 'new-item' };
  const draftPath = 'form-id/draft-blob';
  const draftFile = {
    name: 'draft.txt',
    type: 'text/plain',
    content: draftPath,
    draft: true,
  };

  const createSurvey = (data: Record<string, unknown>) => {
    const survey = new SurveyModel({
      elements: [
        { type: 'file', name: 'documents', allowMultiple: true },
        { type: 'file', name: 'copies', allowMultiple: true },
      ],
    });
    survey.data = data;
    return survey;
  };

  beforeEach(() => {
    environment.csApiUrl = 'https://cs';
    revokeObjectURL = jest.fn();
    (URL as any).revokeObjectURL = revokeObjectURL;
    uploadFile = jest.fn().mockResolvedValue(uploaded);
    updateFile = jest.fn().mockResolvedValue(undefined);
    uploadBlob = jest.fn().mockResolvedValue('form-id/new-blob');
    getFileBlob = jest
      .fn()
      .mockReturnValue(of(new Blob(['hello'], { type: 'text/plain' })));
    mutate = jest
      .fn()
      .mockReturnValue(of({ data: { addRecord: { id: 'draft-id' } } }));
    openSnackBar = jest.fn();
    messages = [];
    triggerSnackBar = jest.fn();
    openComponentSnackBar = jest.fn((_, config) => {
      spinner = {
        /**
         * Records each message shown in the snackbar
         *
         * @param value Message shown
         */
        set message(value: string) {
          messages.push(value);
        },
        /**
         * Last message shown in the snackbar
         *
         * @returns Last message
         */
        get message() {
          return messages[messages.length - 1];
        },
        loading: config.data.loading,
      };
      spinner.message = config.data.message;
      return {
        instance: { nestedComponent: { instance: spinner }, triggerSnackBar },
      };
    });
    TestBed.configureTestingModule({
      providers: [
        FormHelpersService,
        { provide: 'environment', useValue: environment },
        { provide: Apollo, useValue: { mutate } },
        {
          provide: SnackbarService,
          useValue: { openSnackBar, openComponentSnackBar },
        },
        { provide: ConfirmService, useValue: {} },
        {
          provide: TranslateService,
          useValue: {
            instant: (k: string, params?: Record<string, unknown>) =>
              params ? `${k} ${JSON.stringify(params)}` : k,
          },
        },
        { provide: AuthService, useValue: {} },
        { provide: DownloadService, useValue: { uploadBlob, getFileBlob } },
        {
          provide: DocumentManagementService,
          useValue: { uploadFile, updateFile },
        },
        { provide: FileService, useValue: {} },
      ],
    });
    service = TestBed.inject(FormHelpersService);
  });

  describe('draft save', () => {
    it('saves picked files in the back-end storage, flagged as draft files', async () => {
      const raw = new File(['hello'], 'a.txt', { type: 'text/plain' });
      const survey = createSurvey({
        documents: [
          { name: 'a.txt', type: 'text/plain', content: dataUrl },
          { name: 'stored.pdf', content: stored },
          draftFile,
        ],
      });

      await service.uploadFiles(survey, { documents: [raw] }, 'form-id', {
        draft: true,
      });

      expect(uploadBlob).toHaveBeenCalledTimes(1);
      // Silent: no upload snackbars during a draft save
      expect(uploadBlob).toHaveBeenCalledWith(raw, 'file', 'form-id', {
        silent: true,
      });
      // Background save: no progress snackbar
      expect(openComponentSnackBar).not.toHaveBeenCalled();
      // Document management is not involved in drafts
      expect(uploadFile).not.toHaveBeenCalled();
      expect(updateFile).not.toHaveBeenCalled();
      expect(getFileBlob).not.toHaveBeenCalled();
      expect(survey.getValue('documents')).toEqual([
        {
          name: 'a.txt',
          type: 'text/plain',
          content: 'form-id/new-blob',
          draft: true,
        },
        { name: 'stored.pdf', content: stored },
        draftFile,
      ]);
    });

    it('rebuilds files restored from a record saved before their upload', async () => {
      const survey = createSurvey({
        documents: [{ name: 'a.txt', type: 'text/plain', content: dataUrl }],
      });

      await service.uploadFiles(survey, {}, 'form-id', { draft: true });

      const [file] = uploadBlob.mock.calls[0];
      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe('a.txt');
      expect(file.type).toBe('text/plain');
      expect(survey.getValue('documents')[0].draft).toBe(true);
    });
  });

  describe('picked files', () => {
    afterEach(() => {
      delete (globalThis as any).fetch;
    });

    it('uploads the picked file and releases its object URL', async () => {
      const raw = new File(['hello'], 'a.txt', { type: 'text/plain' });
      const survey = createSurvey({
        documents: [{ name: 'a.txt', type: 'text/plain', content: objectUrl }],
        copies: [{ name: 'a.txt', type: 'text/plain', content: objectUrl }],
      });

      await service.uploadFiles(survey, { documents: [raw] }, 'form-id');

      expect(uploadFile).toHaveBeenCalledTimes(1);
      expect(uploadFile.mock.calls[0][0]).toBe(raw);
      expect(survey.getValue('documents')[0].content).toEqual(uploaded);
      expect(survey.getValue('copies')[0].content).toEqual(uploaded);
      expect(revokeObjectURL).toHaveBeenCalledTimes(1);
      expect(revokeObjectURL).toHaveBeenCalledWith(objectUrl);
    });

    it('reads the file back from its object URL when the picked file is not at hand', async () => {
      const fetchMock = jest.fn(() =>
        Promise.resolve({
          blob: () =>
            Promise.resolve(new Blob(['hello'], { type: 'text/plain' })),
        })
      );
      (globalThis as any).fetch = fetchMock;
      const survey = createSurvey({
        documents: [{ name: 'a.txt', type: 'text/plain', content: objectUrl }],
      });

      await service.uploadFiles(survey, {}, 'form-id');

      expect(fetchMock).toHaveBeenCalledWith(objectUrl);
      const [file] = uploadFile.mock.calls[0];
      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe('a.txt');
      expect(file.type).toBe('text/plain');
      expect(survey.getValue('documents')[0].content).toEqual(uploaded);
      expect(revokeObjectURL).toHaveBeenCalledWith(objectUrl);
    });

    it('keeps the object URL of a file that failed to upload', async () => {
      uploadFile.mockRejectedValue(null);
      const raw = new File(['hello'], 'a.txt', { type: 'text/plain' });
      const survey = createSurvey({
        documents: [{ name: 'a.txt', type: 'text/plain', content: objectUrl }],
      });

      await expect(
        service.uploadFiles(survey, { documents: [raw] }, 'form-id')
      ).rejects.toEqual([{ question: 'documents', file: raw }]);

      expect(survey.getValue('documents')[0].content).toBe(objectUrl);
      expect(revokeObjectURL).not.toHaveBeenCalled();
    });
  });

  describe('submission with document management', () => {
    it('uploads picked files and moves draft files to document management', async () => {
      const raw = new File(['hello'], 'a.txt', { type: 'text/plain' });
      const survey = createSurvey({
        documents: [
          { name: 'a.txt', type: 'text/plain', content: dataUrl },
          draftFile,
          { name: 'legacy.pdf', content: 'form-id/legacy-blob' },
          { name: 'stored.pdf', content: stored },
        ],
      });
      uploadFile.mockImplementation((file: File) =>
        Promise.resolve({
          driveId: 'drive',
          itemId: `item-${file.name}`,
        })
      );

      await service.uploadFiles(survey, { documents: [raw] }, 'form-id');

      expect(uploadBlob).not.toHaveBeenCalled();
      expect(getFileBlob).toHaveBeenCalledTimes(1);
      expect(getFileBlob).toHaveBeenCalledWith(
        `download/file/${draftPath}`,
        'text/plain'
      );
      expect(uploadFile).toHaveBeenCalledTimes(2);
      expect(uploadFile.mock.calls[0][0]).toBe(raw);
      expect(uploadFile.mock.calls[0][2]).toEqual({ silent: true });
      // One snackbar for both uploads, counting the files as they go
      expect(openComponentSnackBar).toHaveBeenCalledTimes(1);
      expect(messages).toEqual([
        'common.notifications.file.upload.progress {"current":1,"total":2}',
        'common.notifications.file.upload.progress {"current":2,"total":2}',
        'common.notifications.file.upload.uploaded {"total":2}',
      ]);
      expect(spinner.loading).toBe(false);
      expect(spinner.error).toBe(false);
      expect(triggerSnackBar).toHaveBeenCalledWith(3000);
      const movedFile = uploadFile.mock.calls[1][0];
      expect(movedFile).toBeInstanceOf(File);
      expect(movedFile.name).toBe('draft.txt');
      expect(movedFile.type).toBe('text/plain');
      expect(uploadFile.mock.calls[1][1].name).toBe('documents');
      expect(survey.getValue('documents')).toEqual([
        {
          name: 'a.txt',
          type: 'text/plain',
          content: { driveId: 'drive', itemId: 'item-a.txt' },
        },
        {
          name: 'draft.txt',
          type: 'text/plain',
          content: { driveId: 'drive', itemId: 'item-draft.txt' },
        },
        { name: 'legacy.pdf', content: 'form-id/legacy-blob' },
        { name: 'stored.pdf', content: stored },
      ]);
      // Stored files get their properties synced on submission
      expect(updateFile).toHaveBeenCalledTimes(1);
      expect(updateFile.mock.calls[0][0]).toEqual({
        name: 'stored.pdf',
        content: stored,
      });
    });

    it('skips the files of a question cleared on completion, keeps the ones of a hidden storage question', async () => {
      const survey = new SurveyModel({
        elements: [
          { type: 'text', name: 'kind' },
          {
            type: 'file',
            name: 'conditional',
            allowMultiple: true,
            visibleIf: '{kind} = "other"',
          },
          {
            type: 'file',
            name: 'storage',
            allowMultiple: true,
            visible: false,
            clearIfInvisible: 'none',
          },
        ],
      });
      survey.data = {
        conditional: [{ ...draftFile, name: 'conditional.txt' }],
        storage: [{ ...draftFile, name: 'storage.txt' }],
      };

      await service.uploadFiles(survey, {}, 'form-id');

      expect(uploadFile).toHaveBeenCalledTimes(1);
      expect(uploadFile.mock.calls[0][0].name).toBe('storage.txt');
      expect(survey.getValue('storage')).toEqual([
        { name: 'storage.txt', type: 'text/plain', content: uploaded },
      ]);
      expect(survey.getValue('conditional')[0].draft).toBe(true);
    });

    it('shares the upload of a picked file with its copies', async () => {
      const raw = new File(['hello'], 'a.txt', { type: 'text/plain' });
      const survey = createSurvey({
        documents: [{ name: 'a.txt', type: 'text/plain', content: dataUrl }],
        copies: [{ name: 'a.txt', type: 'text/plain', content: dataUrl }],
      });

      await service.uploadFiles(survey, { documents: [raw] }, 'form-id');

      expect(uploadFile).toHaveBeenCalledTimes(1);
      expect(uploadFile.mock.calls[0][0]).toBe(raw);
      expect(survey.getValue('documents')[0].content).toEqual(uploaded);
      expect(survey.getValue('copies')[0].content).toEqual(uploaded);
      // The copy counts as a single upload
      expect(messages).toEqual([
        'common.notifications.file.upload.progress {"current":1,"total":1}',
        'common.notifications.file.upload.uploaded {"total":1}',
      ]);
    });

    it('keeps the files that failed pending and reports them', async () => {
      uploadFile.mockImplementation((file: File) =>
        file.name === 'b.txt' ? Promise.reject(null) : Promise.resolve(uploaded)
      );
      getFileBlob.mockReturnValue(throwError(() => new Error('not found')));
      const survey = createSurvey({
        documents: [
          { name: 'a.txt', content: dataUrl },
          { name: 'b.txt', content: otherDataUrl },
          draftFile,
        ],
      });

      let errors: unknown;
      await service.uploadFiles(survey, {}, 'form-id').catch((e) => {
        errors = e;
      });

      expect(errors).toEqual([
        {
          question: 'documents',
          file: expect.objectContaining({ name: 'b.txt' }),
        },
        { question: 'documents', file: { name: 'draft.txt' } },
      ]);
      expect(service.getUploadErrorMessage(errors)).toBe(
        'models.form.notifications.savingFailed\ndocuments: b.txt\ndocuments: draft.txt'
      );
      expect(survey.getValue('documents')).toEqual([
        { name: 'a.txt', content: uploaded },
        { name: 'b.txt', content: otherDataUrl },
        draftFile,
      ]);
      // Failures are counted in the progress and reported in the result
      expect(messages).toEqual([
        'common.notifications.file.upload.progress {"current":1,"total":3}',
        'common.notifications.file.upload.progress {"current":2,"total":3}',
        'common.notifications.file.upload.progress {"current":3,"total":3}',
        'common.notifications.file.upload.failed {"failed":2,"total":3}',
      ]);
      expect(spinner.error).toBe(true);
    });

    it('treats an upload without stored reference as a failure', async () => {
      uploadFile.mockResolvedValue(null);
      const survey = createSurvey({
        documents: [{ name: 'a.txt', content: dataUrl }],
      });

      await expect(service.uploadFiles(survey, {}, 'form-id')).rejects.toEqual([
        {
          question: 'documents',
          file: expect.objectContaining({ name: 'a.txt' }),
        },
      ]);
      expect(survey.getValue('documents')[0].content).toBe(dataUrl);
    });
  });

  describe('submission without document management', () => {
    beforeEach(() => {
      environment.csApiUrl = undefined;
    });

    it('uploads picked files to the back-end storage and keeps draft files there', async () => {
      const survey = createSurvey({
        documents: [{ name: 'a.txt', content: dataUrl }, draftFile],
      });

      await service.uploadFiles(survey, {}, 'form-id');

      expect(uploadFile).not.toHaveBeenCalled();
      expect(getFileBlob).not.toHaveBeenCalled();
      expect(uploadBlob).toHaveBeenCalledTimes(1);
      expect(uploadBlob.mock.calls[0][0].name).toBe('a.txt');
      expect(uploadBlob.mock.calls[0][2]).toBe('form-id');
      // Progress is reported for all the files at once
      expect(uploadBlob.mock.calls[0][3]).toEqual({ silent: true });
      expect(survey.getValue('documents')).toEqual([
        { name: 'a.txt', content: 'form-id/new-blob' },
        // The draft flag is dropped: the back-end storage is final
        { name: 'draft.txt', type: 'text/plain', content: draftPath },
      ]);
    });
  });

  describe('saveAsDraft', () => {
    it('saves the picked files in the back-end storage before the draft', async () => {
      const survey = createSurvey({
        documents: [
          { name: 'a.txt', content: dataUrl },
          { name: 'stored.pdf', content: stored },
        ],
      });
      const callback = jest.fn();

      await service.saveAsDraft(survey, 'form-id', {}, undefined, callback);

      expect(uploadBlob).toHaveBeenCalledTimes(1);
      expect(uploadFile).not.toHaveBeenCalled();
      expect(updateFile).not.toHaveBeenCalled();
      expect(mutate).toHaveBeenCalledTimes(1);
      expect(mutate.mock.calls[0][0].variables).toEqual({
        form: 'form-id',
        data: {
          documents: [
            { name: 'a.txt', content: 'form-id/new-blob', draft: true },
            { name: 'stored.pdf', content: stored },
          ],
        },
      });
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'draft-id' })
      );
    });

    it('does not save a draft when a file upload fails', async () => {
      uploadBlob.mockRejectedValue(undefined);
      const survey = createSurvey({
        documents: [{ name: 'a.txt', content: dataUrl }],
      });
      const callback = jest.fn();
      const errorCallback = jest.fn();

      await service.saveAsDraft(
        survey,
        'form-id',
        {},
        'draft-id',
        callback,
        errorCallback
      );

      expect(mutate).not.toHaveBeenCalled();
      expect(callback).not.toHaveBeenCalled();
      expect(errorCallback).toHaveBeenCalledTimes(1);
      expect(openSnackBar).toHaveBeenCalledWith(
        'models.form.notifications.savingFailed\ndocuments: a.txt',
        { error: true }
      );
    });
  });
});
