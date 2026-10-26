import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule, IconModule, TooltipModule } from '@oort-front/ui';
import { GridModule } from '@progress/kendo-angular-grid';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { omit } from 'lodash';
import { SurveyModel } from 'survey-core';
import { File } from '../../services/file/file.service';
import {
  getFileIcon,
  isOutdatedFile,
  isStoredFile,
} from '../../services/file/file.utils';
import { FileItemActionsComponent } from '../../survey/components/file-item-actions/public-api';
import { FilesManagementQuestion } from '../../survey/components/files-management';
import {
  areTranslationsEnabled,
  getFileQuestions,
  getMissingTranslationLanguages,
  getTranslationLanguages,
  getTranslations,
  getTranslationSource,
  linkTranslation,
} from '../../survey/components/utils/files-widgets.util';
import { QuestionFile } from '../../survey/types';
import { getLanguageName } from '../../utils/languages';
import { EmptyModule } from '../ui/empty/empty.module';
import {
  FileTranslationModalComponent,
  FileTranslationResult,
} from './file-translation-modal/file-translation-modal.component';

/** A single row of the files management table. */
export interface FileManagementRow {
  /** Underlying file, as stored in the file question's value */
  file: File;
  /** Kendo icon class matching the file extension */
  icon: string;
  /** Display name of the file question */
  fieldTitle: string;
  /** Display name of the row's language, empty when the file has none */
  languageLabel: string;
  /** Whether the file was marked as outdated */
  outdated: boolean;
  /** Status of the file: to upload on save, outdated, or active */
  status: 'pending' | 'outdated' | 'active';
  /** Whether the file can be marked as outdated / active */
  canOutdate: boolean;
  /** Whether the file can be removed */
  canRemove: boolean;
  /** Whether the removal is permanent ( file question allowing outdated files ) */
  permanentRemoval: boolean;
  /** Whether the file is a translation of another listed file, displayed right under it */
  isTranslation: boolean;
  /** Name of the file this one translates ( translations only ) */
  sourceName?: string;
  /** Translation key of the file this one translates ( translations only ) */
  sourceKey?: string;
  /** Display names of the languages the file is translated in */
  translationLanguages: string[];
  /** Names of the translations of the file */
  translationFileNames: string[];
  /** Display names of the translation languages the file is still missing */
  missingLanguages: string[];
  /** Sort key of the translations column */
  translationLabel: string;
  /** Whether a translation of the file can be added */
  canTranslate: boolean;
  /** Marks the file as outdated, or as active if already outdated */
  toggleOutdated: () => void;
  /** Removes the file from its question */
  removeFile: () => void;
  /** Opens the modal adding a translation of the file */
  translate: () => void;
}

/**
 * Rendered inside a Files management SurveyJS question: lists every file held
 * by the survey's file questions, with the same actions as the file
 * questions ( download, mark as outdated / active, remove ). When the
 * question allows translations, it also shows which files are translated,
 * lists each translation right under the file it translates, and lets users
 * add the missing translations.
 */
@Component({
  standalone: true,
  selector: 'shared-files-management-question',
  templateUrl: './files-management-question.component.html',
  styleUrls: ['./files-management-question.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    GridModule,
    EmptyModule,
    ButtonModule,
    IconModule,
    TooltipModule,
    FileItemActionsComponent,
  ],
})
export class FilesManagementQuestionComponent {
  /** Survey owning the question */
  @Input() survey?: SurveyModel;
  /** The Files management question instance being rendered */
  @Input() question?: FilesManagementQuestion;

  /** Rows of the table, sorted */
  public rows: FileManagementRow[] = [];
  /** Current sort of the table */
  public sort: SortDescriptor[] = [];
  /** Whether the question allows translations ( translations column and action ) */
  public translationsEnabled = false;
  /** Last error raised while adding a translation */
  public errorMessage = '';

  /**
   * Kendo row class callback: flags the rows of translations.
   *
   * @param context Row context
   * @param context.dataItem Row
   * @returns Row classes
   */
  public rowClass = (context: {
    dataItem: FileManagementRow;
  }): Record<string, boolean> => ({
    'files-management-question__translation': context.dataItem.isTranslation,
  });

  /**
   * Rendered inside a Files management SurveyJS question.
   *
   * @param translate Angular translation service
   * @param cdr Change detector of the component
   * @param dialog CDK dialog service
   * @param environment Injected environment ( available languages )
   */
  constructor(
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private dialog: Dialog,
    @Inject('environment') private environment: any
  ) {}

  /**
   * Rebuilds the rows from every file question of the survey. Called by the
   * SurveyJS question after every render and whenever a file question value
   * changes.
   */
  refresh(): void {
    this.translationsEnabled = areTranslationsEnabled(this.question);
    const translationLanguages = this.translationsEnabled
      ? getTranslationLanguages(
          this.question,
          this.survey,
          this.environment?.availableLanguages ?? []
        )
      : [];
    const questions = getFileQuestions(this.survey) as QuestionFile[];
    const allFiles: File[] = questions
      .flatMap((question) =>
        Array.isArray(question.value) ? (question.value as File[]) : []
      )
      .filter((file) => !!file);
    const rows: FileManagementRow[] = [];
    for (const question of questions) {
      const value: File[] = Array.isArray(question.value) ? question.value : [];
      const readOnly = !!this.survey?.isDesignMode || question.isReadOnly;
      const fieldTitle = question.title || question.valueName || question.name;
      for (const file of value) {
        if (!file) {
          continue;
        }
        const stored = isStoredFile(file);
        const outdated = isOutdatedFile(file);
        const permanentRemoval = !!question.allowOutdatedFiles && stored;
        // A translation whose source is gone is listed as a file of its own
        const source = this.translationsEnabled
          ? getTranslationSource(file, allFiles)
          : undefined;
        const translations =
          this.translationsEnabled && !source
            ? getTranslations(file, allFiles)
            : [];
        // An outdated file is not translated anymore
        const missing =
          this.translationsEnabled && !source && !outdated
            ? getMissingTranslationLanguages(
                file,
                translations,
                translationLanguages
              )
            : [];
        const translatedIn = translations.map((item) =>
          item.lang ? this.languageName(item.lang) : ''
        );
        const missingLanguages = missing.map((code) => this.languageName(code));
        rows.push({
          file,
          icon: getFileIcon(file.name),
          fieldTitle,
          languageLabel: file.lang ? this.languageName(file.lang) : '',
          outdated,
          status: !stored ? 'pending' : outdated ? 'outdated' : 'active',
          canOutdate: !readOnly && permanentRemoval,
          // Removing a stored file is a per-field role permission. Files not
          // saved yet can always be removed.
          canRemove:
            !readOnly && (!stored || question.canDeleteFiles !== false),
          permanentRemoval,
          isTranslation: !!source,
          sourceName: source?.name,
          sourceKey: source?.translationKey,
          translationLanguages: translatedIn,
          translationFileNames: translations.map((item) => item.name),
          missingLanguages,
          translationLabel: source?.name ?? translatedIn.join(', '),
          canTranslate: !readOnly && !source && missing.length > 0,
          toggleOutdated: () => this.toggleOutdated(question, file),
          removeFile: () => question.doRemoveFile(file),
          translate: () => this.openTranslation(question, file, missing),
        });
      }
    }
    this.rows = this.orderRows(rows);
  }

  /**
   * Sorts the rows.
   *
   * @param sort New sort descriptors
   */
  onSortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.rows = this.orderRows(this.rows);
  }

  /**
   * Sorts the rows. With translations, the sort applies to the translated
   * files and the files of their own, each translation staying right under
   * the file it translates.
   *
   * @param rows Rows to sort
   * @returns Sorted rows
   */
  private orderRows(rows: FileManagementRow[]): FileManagementRow[] {
    if (!this.translationsEnabled) {
      return orderBy(rows, this.sort);
    }
    const translations = rows.filter((row) => row.isTranslation);
    return orderBy(
      rows.filter((row) => !row.isTranslation),
      this.sort
    ).flatMap((row) => [
      row,
      ...translations.filter(
        (translation) => translation.sourceKey === row.file.translationKey
      ),
    ]);
  }

  /**
   * Opens the modal picking a translation of a file, and adds the picked
   * translation to the file question holding the file.
   *
   * @param question File question holding the file
   * @param file File to translate
   * @param languages Codes of the languages the file can be translated into
   */
  openTranslation(
    question: QuestionFile,
    file: File,
    languages: string[]
  ): void {
    const value: File[] = Array.isArray(question.value) ? question.value : [];
    const dialogRef = this.dialog.open<FileTranslationResult | undefined>(
      FileTranslationModalComponent,
      {
        data: {
          file,
          question,
          languages: languages.map((code) => ({
            value: code,
            text: this.languageName(code),
          })),
          existingCount: value.length,
        },
      }
    );
    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.addTranslation(question, file, result);
      }
    });
  }

  /**
   * Adds a translation of a file to the file question holding it, linked to
   * the file by a shared translation key. The translated file is read through
   * the same `survey.uploadFiles` flow as the native file question, so the
   * temporary files storage / save pipeline picks it up unchanged: it is
   * uploaded when the record is saved, like any other file.
   *
   * @param question File question holding the file
   * @param source File being translated
   * @param result Picked translation
   */
  private addTranslation(
    question: QuestionFile,
    source: File,
    result: FileTranslationResult
  ): void {
    if (!this.survey) {
      return;
    }
    this.survey.uploadFiles(
      question,
      question.name,
      [result.file],
      (
        status: string,
        data?: { file: globalThis.File; content: unknown }[]
      ) => {
        const uploaded = data?.[0];
        if (status !== 'success' || !uploaded) {
          this.errorMessage = this.translate.instant(
            'components.filesUpload.errors.uploadFailed'
          );
          this.cdr.detectChanges();
          return;
        }
        const current: File[] = Array.isArray(question.value)
          ? question.value
          : [];
        question.value = linkTranslation(current, source, {
          name: uploaded.file.name,
          type: uploaded.file.type,
          content: uploaded.content as File['content'],
          lang: result.language,
        });
        this.errorMessage = '';
        this.cdr.detectChanges();
      }
    );
  }

  /**
   * Display name of a language, in the current language of the user.
   *
   * @param code Language code
   * @returns Language name
   */
  private languageName(code: string): string {
    return getLanguageName(code, this.translate);
  }

  /**
   * Marks a file as outdated, or back as active when it already is. The
   * question value is replaced ( not mutated ) so SurveyJS detects the
   * change, like the native file question does.
   *
   * @param question File question holding the file
   * @param file File to update
   */
  private toggleOutdated(question: QuestionFile, file: File): void {
    const value: File[] = Array.isArray(question.value) ? question.value : [];
    const index = value.indexOf(file);
    if (index < 0) {
      return;
    }
    const updated: File = isOutdatedFile(file)
      ? (omit(file, ['outdated', 'outdatedAt']) as File)
      : { ...file, outdated: true, outdatedAt: new Date().toISOString() };
    question.value = value.map((item, i) => (i === index ? updated : item));
  }
}
