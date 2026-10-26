import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SurveyModel } from 'survey-core';
import { FilesManagementQuestion } from '../../survey/components/files-management';
import {
  ALLOW_TRANSLATIONS_PROPERTY,
  TRANSLATION_LANGUAGES_PROPERTY,
} from '../../survey/components/utils/files-widgets.util';
import { QuestionFile } from '../../survey/types';
import { FileTranslationModalComponent } from './file-translation-modal/file-translation-modal.component';
import { FilesManagementQuestionComponent } from './files-management-question.component';

describe('FilesManagementQuestionComponent', () => {
  let survey: SurveyModel;
  let component: FilesManagementQuestionComponent;
  let dialog: { open: jest.Mock };

  /** Files of the attachments question */
  const pending = { name: 'pending.pdf', content: 'data:x', lang: 'fr' };
  const active = { name: 'active.png', content: 'file-id' };
  const outdated = {
    name: 'outdated.docx',
    content: { driveId: 'drive', itemId: 'item' },
    outdated: true,
    outdatedAt: '2026-01-01',
  };

  beforeEach(() => {
    survey = new SurveyModel({
      elements: [
        { type: 'file', name: 'attachments', title: 'Attachments' },
        { type: 'file', name: 'cover', valueName: 'cover_image' },
      ],
    });
    survey.setValue('attachments', [pending, active, outdated]);
    // Stored under the question data field
    survey.setValue('cover_image', [
      { name: 'cover.png', content: 'cover-id' },
    ]);
    dialog = { open: jest.fn() };
    component = new FilesManagementQuestionComponent(
      {
        instant: (key: string) => key,
        currentLang: 'en',
        defaultLang: 'en',
      } as unknown as TranslateService,
      { detectChanges: jest.fn() } as unknown as ChangeDetectorRef,
      dialog as unknown as Dialog,
      { availableLanguages: ['en', 'fr', 'es'] }
    );
    component.survey = survey;
  });

  /**
   * Builds a fake files management question configured for translations.
   *
   * @param allowTranslations Whether translations are allowed
   * @param translationLanguages Translation languages
   * @returns Fake question
   */
  const createQuestion = (
    allowTranslations: boolean,
    translationLanguages?: string[]
  ): FilesManagementQuestion =>
    ({
      getPropertyValue: (name: string) =>
        name === ALLOW_TRANSLATIONS_PROPERTY
          ? allowTranslations
          : name === TRANSLATION_LANGUAGES_PROPERTY
          ? translationLanguages
          : undefined,
    } as unknown as FilesManagementQuestion);

  /**
   * Gets the attachments question.
   *
   * @returns Attachments question
   */
  const attachments = (): QuestionFile =>
    survey.getQuestionByName('attachments') as QuestionFile;

  it('shows the files saved with a draft as pending, removable by anyone', () => {
    survey.setValue('attachments', [
      { name: 'draft.png', content: 'form-id/blob', draft: true },
    ]);
    attachments().canDeleteFiles = false;
    component.refresh();

    expect(
      component.rows.map((row) => [
        row.file.name,
        row.status,
        row.canRemove,
        row.permanentRemoval,
      ])
    ).toEqual([
      ['draft.png', 'pending', true, false],
      ['cover.png', 'active', true, false],
    ]);
  });

  it('lists every file of the survey with its document type, language and status', () => {
    component.refresh();

    expect(
      component.rows.map((row) => [
        row.file.name,
        row.fieldTitle,
        row.languageLabel,
        row.status,
        row.icon,
      ])
    ).toEqual([
      ['pending.pdf', 'Attachments', 'French', 'pending', 'k-i-file-pdf'],
      ['active.png', 'Attachments', '', 'active', 'k-i-file-image'],
      ['outdated.docx', 'Attachments', '', 'outdated', 'k-i-file-word'],
      ['cover.png', 'cover', '', 'active', 'k-i-file-image'],
    ]);
    expect(component.rows.map((row) => row.outdated)).toEqual([
      false,
      false,
      true,
      false,
    ]);
  });

  it('only offers the outdated actions on stored files of questions allowing them', () => {
    component.refresh();
    expect(component.rows.map((row) => row.canOutdate)).toEqual([
      false,
      false,
      false,
      false,
    ]);

    attachments().allowOutdatedFiles = true;
    component.refresh();
    expect(
      component.rows.map((row) => [row.canOutdate, row.permanentRemoval])
    ).toEqual([
      [false, false],
      [true, true],
      [true, true],
      [false, false],
    ]);
  });

  it('follows the per-field permission to remove stored files', () => {
    attachments().canDeleteFiles = false;
    component.refresh();

    // Files not saved yet can always be removed
    expect(component.rows.map((row) => row.canRemove)).toEqual([
      true,
      false,
      false,
      true,
    ]);
  });

  it('offers no action in the form builder or in read-only surveys', () => {
    attachments().allowOutdatedFiles = true;
    survey.setDesignMode(true);
    component.refresh();
    expect(
      component.rows.every((row) => !row.canRemove && !row.canOutdate)
    ).toBe(true);

    survey.setDesignMode(false);
    survey.mode = 'display';
    component.refresh();
    expect(
      component.rows.every((row) => !row.canRemove && !row.canOutdate)
    ).toBe(true);
  });

  it('marks a file as outdated and back as active, replacing the question value', () => {
    attachments().allowOutdatedFiles = true;
    component.refresh();
    const before = survey.getValue('attachments');

    component.rows[1].toggleOutdated();
    const after = survey.getValue('attachments');
    expect(after).not.toBe(before);
    expect(after[1]).toEqual({
      ...active,
      outdated: true,
      outdatedAt: expect.any(String),
    });

    component.refresh();
    component.rows[2].toggleOutdated();
    expect(survey.getValue('attachments')[2]).toEqual({
      name: outdated.name,
      content: outdated.content,
    });
  });

  it('removes a file through the file question itself', () => {
    const doRemoveFile = jest
      .spyOn(attachments(), 'doRemoveFile')
      .mockImplementation(() => undefined);
    component.refresh();

    component.rows[0].removeFile();

    expect(doRemoveFile).toHaveBeenCalledWith(pending);
  });

  it('sorts the rows and keeps the sort across refreshes', () => {
    component.refresh();
    component.onSortChange([{ field: 'file.name', dir: 'asc' }]);
    expect(component.rows.map((row) => row.file.name)).toEqual([
      'active.png',
      'cover.png',
      'outdated.docx',
      'pending.pdf',
    ]);

    survey.setValue('cover_image', []);
    component.refresh();
    expect(component.rows.map((row) => row.file.name)).toEqual([
      'active.png',
      'outdated.docx',
      'pending.pdf',
    ]);
  });

  it('lists nothing without a survey', () => {
    component.survey = undefined;
    component.refresh();
    expect(component.rows).toEqual([]);
  });

  describe('translations', () => {
    const source = {
      name: 'a.pdf',
      content: 'id-a',
      lang: 'en',
      translationKey: 'k',
    };
    const french = {
      name: 'a-fr.pdf',
      content: 'id-fr',
      lang: 'fr',
      translationOf: 'k',
    };
    const untranslated = { name: 'b.pdf', content: 'id-b', lang: 'en' };
    const outdatedFile = {
      name: 'old.pdf',
      content: 'id-old',
      lang: 'en',
      outdated: true,
      outdatedAt: '2026-01-01',
    };

    beforeEach(() => {
      // Form translated in French and Spanish
      survey = new SurveyModel({
        title: { default: 'Hello', fr: 'Bonjour', es: 'Hola' },
        elements: [{ type: 'file', name: 'attachments', allowMultiple: true }],
      });
      survey.setValue('attachments', [
        untranslated,
        source,
        outdatedFile,
        french,
      ]);
      component.survey = survey;
      component.question = createQuestion(true, ['fr', 'es']);
    });

    it('lists every file as usual when the question does not allow translations', () => {
      component.question = createQuestion(false, ['fr', 'es']);
      component.refresh();

      expect(component.translationsEnabled).toBe(false);
      expect(component.rows.map((row) => row.file.name)).toEqual([
        'b.pdf',
        'a.pdf',
        'old.pdf',
        'a-fr.pdf',
      ]);
      expect(
        component.rows.every(
          (row) =>
            !row.canTranslate &&
            !row.isTranslation &&
            !row.translationLanguages.length &&
            !row.missingLanguages.length
        )
      ).toBe(true);
    });

    it('lists each translation under the file it translates, with the translations missing', () => {
      component.refresh();

      expect(component.translationsEnabled).toBe(true);
      expect(
        component.rows.map((row) => [
          row.file.name,
          row.isTranslation,
          row.sourceName,
          row.translationLanguages,
          row.translationFileNames,
          row.missingLanguages,
          row.canTranslate,
        ])
      ).toEqual([
        ['b.pdf', false, undefined, [], [], ['French', 'Spanish'], true],
        [
          'a.pdf',
          false,
          undefined,
          ['French'],
          ['a-fr.pdf'],
          ['Spanish'],
          true,
        ],
        ['a-fr.pdf', true, 'a.pdf', [], [], [], false],
        // Outdated files are not translated anymore
        ['old.pdf', false, undefined, [], [], [], false],
      ]);
      expect(component.rowClass({ dataItem: component.rows[2] })).toEqual({
        'files-management-question__translation': true,
      });
    });

    it('keeps the translations under their file when sorting', () => {
      component.refresh();
      component.onSortChange([{ field: 'file.name', dir: 'desc' }]);
      expect(component.rows.map((row) => row.file.name)).toEqual([
        'old.pdf',
        'b.pdf',
        'a.pdf',
        'a-fr.pdf',
      ]);

      component.refresh();
      expect(component.rows.map((row) => row.file.name)).toEqual([
        'old.pdf',
        'b.pdf',
        'a.pdf',
        'a-fr.pdf',
      ]);
    });

    it('lists a translation whose file is gone as a file of its own', () => {
      survey.setValue('attachments', [french]);
      component.refresh();
      expect(component.rows[0].isTranslation).toBe(false);
      expect(component.rows[0].missingLanguages).toEqual(['Spanish']);
      expect(component.rows[0].canTranslate).toBe(true);
    });

    it('offers no translation in the form builder or in read-only surveys', () => {
      survey.setDesignMode(true);
      component.refresh();
      expect(component.translationsEnabled).toBe(true);
      expect(component.rows.every((row) => !row.canTranslate)).toBe(true);

      survey.setDesignMode(false);
      survey.mode = 'display';
      component.refresh();
      expect(component.rows.every((row) => !row.canTranslate)).toBe(true);
    });

    it('adds the picked translation to the file question, pointing to its file', () => {
      const picked = new File(['x'], 'b-fr.pdf', { type: 'application/pdf' });
      dialog.open.mockReturnValue({
        closed: of({ language: 'fr', file: picked }),
      });
      const uploadFiles = jest
        .spyOn(survey, 'uploadFiles')
        .mockImplementation((_q, _n, files, callback: any) =>
          callback(
            'success',
            files.map((file) => ({ file, content: 'blob:picked' }))
          )
        );
      component.refresh();

      component.rows[0].translate();

      expect(dialog.open).toHaveBeenCalledWith(FileTranslationModalComponent, {
        data: {
          file: untranslated,
          question: attachments(),
          languages: [
            { value: 'fr', text: 'French' },
            { value: 'es', text: 'Spanish' },
          ],
          existingCount: 4,
        },
      });
      expect(uploadFiles).toHaveBeenCalledWith(
        attachments(),
        'attachments',
        [picked],
        expect.any(Function)
      );
      const value = survey.getValue('attachments');
      expect(value).toHaveLength(5);
      const key = value[0].translationKey;
      expect(key).toEqual(expect.any(String));
      expect(value[0]).toEqual({ ...untranslated, translationKey: key });
      expect(value[4]).toEqual({
        name: 'b-fr.pdf',
        type: 'application/pdf',
        content: 'blob:picked',
        lang: 'fr',
        translationOf: key,
      });
      expect(component.errorMessage).toBe('');

      // The new translation is listed under its file
      component.refresh();
      expect(component.rows.map((row) => row.file.name)).toEqual([
        'b.pdf',
        'b-fr.pdf',
        'a.pdf',
        'a-fr.pdf',
        'old.pdf',
      ]);
      expect(component.rows[0].translationLanguages).toEqual(['French']);
      expect(component.rows[0].missingLanguages).toEqual(['Spanish']);
      expect(component.rows[1].sourceName).toBe('b.pdf');
    });

    it('does nothing when the modal is cancelled', () => {
      dialog.open.mockReturnValue({ closed: of(undefined) });
      const uploadFiles = jest.spyOn(survey, 'uploadFiles');
      component.refresh();

      component.rows[0].translate();

      expect(uploadFiles).not.toHaveBeenCalled();
      expect(survey.getValue('attachments')).toHaveLength(4);
    });

    it('reports a translation that could not be added', () => {
      dialog.open.mockReturnValue({
        closed: of({
          language: 'fr',
          file: new File(['x'], 'b-fr.pdf', { type: 'application/pdf' }),
        }),
      });
      jest
        .spyOn(survey, 'uploadFiles')
        .mockImplementation((_q, _n, _f, callback: any) => callback('error'));
      component.refresh();

      component.rows[0].translate();

      expect(component.errorMessage).toBe(
        'components.filesUpload.errors.uploadFailed'
      );
      expect(survey.getValue('attachments')).toHaveLength(4);
    });
  });
});
