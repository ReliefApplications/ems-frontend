import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { getFileQuestions } from '../../survey/components/utils/files-widgets.util';
import { QuestionFile } from '../../survey/types';
import { getLanguageName } from '../../utils/languages';
import { EmptyModule } from '../ui/empty/empty.module';

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
  /** Marks the file as outdated, or as active if already outdated */
  toggleOutdated: () => void;
  /** Removes the file from its question */
  removeFile: () => void;
}

/**
 * Rendered inside a Files management SurveyJS question: lists every file held
 * by the survey's file questions, with the same actions as the file
 * questions ( download, mark as outdated / active, remove ).
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

  /**
   * Rendered inside a Files management SurveyJS question.
   *
   * @param translate Angular translation service
   */
  constructor(private translate: TranslateService) {}

  /**
   * Rebuilds the rows from every file question of the survey. Called by the
   * SurveyJS question after every render and whenever a file question value
   * changes.
   */
  refresh(): void {
    const rows: FileManagementRow[] = [];
    for (const question of getFileQuestions(this.survey) as QuestionFile[]) {
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
        rows.push({
          file,
          icon: getFileIcon(file.name),
          fieldTitle,
          languageLabel: file.lang
            ? getLanguageName(file.lang, this.translate)
            : '',
          outdated,
          status: !stored ? 'pending' : outdated ? 'outdated' : 'active',
          canOutdate: !readOnly && permanentRemoval,
          // Removing a stored file is a per-field role permission. Files not
          // saved yet can always be removed.
          canRemove:
            !readOnly && (!stored || question.canDeleteFiles !== false),
          permanentRemoval,
          toggleOutdated: () => this.toggleOutdated(question, file),
          removeFile: () => question.doRemoveFile(file),
        });
      }
    }
    this.rows = orderBy(rows, this.sort);
  }

  /**
   * Sorts the rows.
   *
   * @param sort New sort descriptors
   */
  onSortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.rows = orderBy(this.rows, this.sort);
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
