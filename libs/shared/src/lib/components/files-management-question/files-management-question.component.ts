import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LabelModule } from '@progress/kendo-angular-label';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { omit } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { SurveyModel } from 'survey-core';
import { File, FileService } from '../../services/file/file.service';
import {
  getFileIcon,
  isOutdatedFile,
  isStoredFile,
} from '../../services/file/file.utils';
import { FilesManagementQuestion } from '../../survey/components/files-management';
import {
  getFileQuestions,
  getLanguageChoices,
  getLanguageText,
  WidgetChoice,
} from '../../survey/components/utils/files-widgets.util';
import { QuestionFile } from '../../survey/types';
import { EmptyModule } from '../ui/empty/empty.module';

/** A single row of the files management table. */
export interface FileManagementRow {
  /** Underlying file, as stored in the file question's value */
  file: File;
  /** File question the row belongs to */
  question: QuestionFile;
  /** Kendo icon class matching the file extension */
  icon: string;
  /** Display name of the file question */
  fieldTitle: string;
  /** Display name of the row's language, or the "unspecified" bucket */
  languageLabel: string;
  /** Whether the file was marked as outdated */
  outdated: boolean;
  /** Whether the file can be marked as outdated / active */
  canOutdate: boolean;
  /** Whether the file can be removed */
  canRemove: boolean;
}

/** Language filter choice: a language of the form, or every language. */
interface LanguageFilterChoice {
  value: string | null;
  text: string;
}

/**
 * Rendered inside a Files management SurveyJS question: lists every file held
 * by the survey's file questions, filtered to two languages picked for
 * comparison, with download / outdated / remove actions.
 */
@Component({
  standalone: true,
  selector: 'shared-files-management-question',
  templateUrl: './files-management-question.component.html',
  styleUrls: ['./files-management-question.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonsModule,
    DropDownsModule,
    LabelModule,
    GridModule,
    EmptyModule,
  ],
})
export class FilesManagementQuestionComponent implements OnInit, OnDestroy {
  /** Survey owning the question */
  @Input() survey?: SurveyModel;
  /** The Files management question instance being rendered */
  @Input() question?: FilesManagementQuestion;

  /** Choices shared by both language dropdowns ( languages of the form ) */
  public languageChoices: WidgetChoice[] = [];
  /** Extra choice of both dropdowns, lifting the filter */
  public allLanguagesChoice: LanguageFilterChoice = { value: null, text: '' };
  /** First language to compare */
  public languageAControl = new FormControl<string | null>(null);
  /** Second language to compare */
  public languageBControl = new FormControl<string | null>(null);
  /** Rows matching the selected languages, sorted */
  public rows: FileManagementRow[] = [];
  /** Current sort of the table */
  public sort: SortDescriptor[] = [];
  /** Whether the question cannot be used ( form builder ) */
  public disabled = false;

  /** Whether the dropdowns were initialized from the question defaults */
  private initialized = false;
  /** Emits when the component is destroyed */
  private destroy$ = new Subject<void>();

  /**
   * Rendered inside a Files management SurveyJS question.
   *
   * @param translate Angular translation service
   * @param fileService Shared file download service
   */
  constructor(
    private translate: TranslateService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    [this.languageAControl, this.languageBControl].forEach((control) =>
      control.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.computeRows())
    );
  }

  /**
   * (Re)computes the language choices, the selections and the rows from the
   * survey / question. Called by the SurveyJS question after every render
   * and whenever a file question value changes.
   */
  refresh(): void {
    this.languageChoices = getLanguageChoices(this.survey);
    this.allLanguagesChoice = {
      value: null,
      text: this.translate.instant('components.filesManagement.allLanguages'),
    };
    this.disabled = !!this.survey?.isDesignMode;
    const controls: [FormControl<string | null>, string, number][] = [
      [this.languageAControl, 'languageA', 0],
      [this.languageBControl, 'languageB', 1],
    ];
    controls.forEach(([control, property, index]) => {
      const wanted = this.initialized
        ? control.value
        : (this.question?.getPropertyValue(property) as string | undefined) ??
          this.languageChoices[index]?.value ??
          null;
      const value = this.languageChoices.some(
        (choice) => choice.value === wanted
      )
        ? wanted
        : null;
      control.setValue(value, { emitEvent: false });
      if (this.disabled) {
        control.disable({ emitEvent: false });
      } else {
        control.enable({ emitEvent: false });
      }
    });
    this.initialized = true;
    this.computeRows();
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
   * Downloads a row's file, through the same service as the native file
   * question so both stored and freshly picked files resolve.
   *
   * @param row Row to download
   */
  download(row: FileManagementRow): void {
    this.fileService.download(row.file);
  }

  /**
   * Marks a row's file as outdated, or back as active when it already is.
   * The question value is replaced ( not mutated ) so SurveyJS detects the
   * change, like the native file question does.
   *
   * @param row Row to update
   */
  toggleOutdated(row: FileManagementRow): void {
    const value: File[] = Array.isArray(row.question.value)
      ? row.question.value
      : [];
    const index = value.indexOf(row.file);
    if (index < 0) {
      return;
    }
    const updated: File = isOutdatedFile(row.file)
      ? (omit(row.file, ['outdated', 'outdatedAt']) as File)
      : { ...row.file, outdated: true, outdatedAt: new Date().toISOString() };
    row.question.value = value.map((file, i) => (i === index ? updated : file));
  }

  /**
   * Removes a row's file from its question, through SurveyJS's own removal
   * flow ( confirmation, onClearFiles, value update ), so the temporary files
   * storage stays in sync exactly as with the native file question.
   *
   * @param row Row to remove
   */
  remove(row: FileManagementRow): void {
    row.question.doRemoveFile(row.file);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Rebuilds the rows from every file question of the survey, keeping only
   * the files tagged with one of the selected languages, or untagged files
   * ( listed under a neutral "unspecified language" bucket ). A dropdown left
   * on "All languages" does not filter.
   */
  private computeRows(): void {
    if (!this.survey) {
      this.rows = [];
      return;
    }
    const selected = [
      this.languageAControl.value,
      this.languageBControl.value,
    ].filter((language): language is string => !!language);
    const unspecifiedLabel = this.translate.instant(
      'components.filesManagement.unspecifiedLanguage'
    );
    const rows: FileManagementRow[] = [];
    for (const question of getFileQuestions(this.survey) as QuestionFile[]) {
      const value: File[] = Array.isArray(question.value) ? question.value : [];
      const readOnly = this.disabled || question.isReadOnly;
      const fieldTitle = question.title || question.valueName || question.name;
      for (const file of value) {
        if (
          !file ||
          (selected.length &&
            file.language &&
            !selected.includes(file.language))
        ) {
          continue;
        }
        const stored = isStoredFile(file);
        rows.push({
          file,
          question,
          icon: getFileIcon(file.name),
          fieldTitle,
          languageLabel: file.language
            ? getLanguageText(file.language)
            : unspecifiedLabel,
          outdated: isOutdatedFile(file),
          canOutdate: !readOnly && !!question.allowOutdatedFiles && stored,
          // Removing a stored file is a per-field role permission. Files not
          // saved yet can always be removed.
          canRemove:
            !readOnly && (!stored || question.canDeleteFiles !== false),
        });
      }
    }
    this.rows = orderBy(rows, this.sort);
  }
}
