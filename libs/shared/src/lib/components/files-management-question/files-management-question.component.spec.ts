import { TranslateService } from '@ngx-translate/core';
import { SurveyModel } from 'survey-core';
import { QuestionFile } from '../../survey/types';
import { FilesManagementQuestionComponent } from './files-management-question.component';

describe('FilesManagementQuestionComponent', () => {
  let survey: SurveyModel;
  let component: FilesManagementQuestionComponent;

  /** Files of the attachments question */
  const pending = { name: 'pending.pdf', content: 'data:x', language: 'fr' };
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
    component = new FilesManagementQuestionComponent({
      instant: (key: string) => key,
      currentLang: 'en',
      defaultLang: 'en',
    } as unknown as TranslateService);
    component.survey = survey;
  });

  /**
   * Gets the attachments question.
   *
   * @returns Attachments question
   */
  const attachments = (): QuestionFile =>
    survey.getQuestionByName('attachments') as QuestionFile;

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
});
