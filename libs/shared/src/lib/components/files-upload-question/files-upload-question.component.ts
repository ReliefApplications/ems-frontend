import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LabelModule } from '@progress/kendo-angular-label';
import {
  FileInfo,
  FileRestrictions,
  SelectEvent,
  UploadsModule,
} from '@progress/kendo-angular-upload';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { Subject, takeUntil } from 'rxjs';
import { QuestionFileModel, SurveyModel } from 'survey-core';
import { File as StoredFile } from '../../services/file/file.service';
import { getFileIcon, isStoredFile } from '../../services/file/file.utils';
import { FileItemActionsComponent } from '../../survey/components/file-item-actions/public-api';
import { FilesUploadQuestion } from '../../survey/components/files-upload';
import {
  checkFileRestrictions,
  getFileQuestionChoices,
  getFileQuestions,
  getKendoFileRestrictions,
  getLanguageChoices,
  WidgetChoice,
} from '../../survey/components/utils/files-widgets.util';
import { QuestionFile } from '../../survey/types';
import { getLanguageName } from '../../utils/languages';
import { EmptyModule } from '../ui/empty/empty.module';

/** Translation keys of the validation errors raised by the Kendo file select. */
const KENDO_VALIDATION_MESSAGES: Record<string, string> = {
  invalidFileExtension: 'components.filesUpload.errors.invalidType',
  invalidMaxFileSize: 'components.filesUpload.errors.maxSizeExceeded',
};

/** A file of the survey waiting to be uploaded when the record is saved. */
export interface PendingFileRow {
  /** Underlying file, as held in the file question's value */
  file: StoredFile;
  /** Kendo icon class matching the file extension */
  icon: string;
  /** Display name of the file question */
  fieldTitle: string;
  /** Display name of the row's language, empty when the file has none */
  languageLabel: string;
  /** Whether the file can be removed */
  canRemove: boolean;
  /** Removes the file from its question */
  removeFile: () => void;
}

/**
 * Rendered inside a Files upload SurveyJS question: lets the user pick one of
 * the survey's file questions, tag files with a language and add them to it
 * without navigating to that question, and lists every file of the survey
 * waiting to be uploaded. Files are uploaded when the record is saved, like
 * files picked in the file questions themselves.
 */
@Component({
  standalone: true,
  selector: 'shared-files-upload-question',
  templateUrl: './files-upload-question.component.html',
  styleUrls: ['./files-upload-question.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DropDownsModule,
    LabelModule,
    UploadsModule,
    GridModule,
    EmptyModule,
    FileItemActionsComponent,
  ],
})
export class FilesUploadQuestionComponent implements OnInit, OnDestroy {
  /** Survey owning the question */
  @Input() survey?: SurveyModel;
  /** The Files upload question instance being rendered */
  @Input() question?: FilesUploadQuestion;

  /** Choices of the target file question dropdown */
  public targetFieldChoices: WidgetChoice[] = [];
  /** Choices of the language dropdown ( languages of the form ) */
  public languageChoices: WidgetChoice[] = [];
  /** Selected target file question */
  public targetFieldControl = new FormControl<string | null>(null);
  /** Selected language, applied to the files added from now on */
  public languageControl = new FormControl<string | null>(null);
  /** Kendo restrictions of the target file question */
  public restrictions: FileRestrictions = {};
  /** Native file input filter of the target file question */
  public accept = '';
  /** Whether the target file question accepts several files */
  public multiple = true;
  /** Whether the question cannot be used ( form builder, read-only survey ) */
  public disabled = false;
  /** Last validation error, kept until files are successfully added */
  public errorMessage = '';
  /** Files of the survey waiting to be uploaded, sorted */
  public rows: PendingFileRow[] = [];
  /** Current sort of the table */
  public sort: SortDescriptor[] = [];

  /** Emits when the component is destroyed */
  private destroy$ = new Subject<void>();

  /**
   * Rendered inside a Files upload SurveyJS question.
   *
   * @param translate Angular translation service
   * @param cdr Change detector of the component
   * @param environment Injected environment ( available languages )
   */
  constructor(
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    @Inject('environment') private environment: any
  ) {}

  ngOnInit(): void {
    this.targetFieldControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateTargetRestrictions();
        this.errorMessage = '';
      });
  }

  /**
   * (Re)computes the dropdown choices, the selections, the restrictions and
   * the files to upload from the survey / question. Called by the SurveyJS
   * question after every render and whenever a file question value changes.
   */
  refresh(): void {
    this.targetFieldChoices = getFileQuestionChoices(this.survey);
    this.languageChoices = getLanguageChoices(
      this.survey,
      this.environment?.availableLanguages ?? [],
      this.translate
    );
    this.targetFieldControl.setValue(
      this.pickChoice(
        this.targetFieldChoices,
        this.targetFieldControl.value ??
          (this.question?.getPropertyValue('targetField') as string)
      ),
      { emitEvent: false }
    );
    this.languageControl.setValue(
      this.pickChoice(
        this.languageChoices,
        this.languageControl.value ??
          (this.question?.getPropertyValue('defaultLanguage') as string)
      ),
      { emitEvent: false }
    );
    this.disabled =
      !!this.survey?.isDesignMode ||
      !!this.survey?.isDisplayMode ||
      !!this.question?.isReadOnly;
    [this.targetFieldControl, this.languageControl].forEach((control) =>
      this.disabled
        ? control.disable({ emitEvent: false })
        : control.enable({ emitEvent: false })
    );
    this.updateTargetRestrictions();
    this.computeRows();
  }

  /**
   * Adds the files picked in the file select to the target file question,
   * tagged with the selected language, unless they violate its restrictions.
   * Files are read through the same `survey.uploadFiles` flow as the native
   * file question, so the temporary files storage / save pipeline picks them
   * up unchanged. A rejected selection only leaves an error message: files
   * already added stay untouched.
   *
   * @param event Kendo select event
   */
  onSelect(event: SelectEvent): void {
    // The file select is only a picker: the files it selects are held by the
    // target file question, and listed by this question along with the other
    // files of the survey
    event.preventDefault();
    if (this.disabled || !this.survey) {
      return;
    }
    const target = this.targetQuestion;
    if (!target) {
      this.errorMessage = this.translate.instant(
        'components.filesUpload.errors.noTargetField'
      );
      return;
    }
    const invalid = event.files.find((file) => file.validationErrors?.length);
    if (invalid) {
      this.errorMessage = this.validationMessage(invalid);
      return;
    }
    const files = event.files
      .map((file) => file.rawFile)
      .filter((file): file is File => !!file);
    const existingCount = Array.isArray(target.value) ? target.value.length : 0;
    const error = checkFileRestrictions(target, existingCount, files);
    if (error) {
      this.errorMessage = this.translate.instant(error.key, error.params);
      return;
    }
    const language = this.languageControl.value || undefined;
    this.survey.uploadFiles(
      target,
      target.name,
      files,
      (status: string, data?: { file: File; content: unknown }[]) => {
        if (status !== 'success') {
          this.errorMessage = this.translate.instant(
            'components.filesUpload.errors.uploadFailed'
          );
          this.cdr.detectChanges();
          return;
        }
        const additions: StoredFile[] = (data || []).map((result) => ({
          name: result.file.name,
          type: result.file.type,
          content: result.content as StoredFile['content'],
          language,
        }));
        const current: StoredFile[] = Array.isArray(target.value)
          ? target.value
          : [];
        target.value = current.concat(additions);
        this.errorMessage = '';
        this.cdr.detectChanges();
      }
    );
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Currently selected target file question, if any.
   *
   * @returns The file question matching the current dropdown selection
   */
  private get targetQuestion(): QuestionFileModel | undefined {
    const name = this.targetFieldControl.value;
    if (!this.survey || !name) {
      return undefined;
    }
    const question = this.survey.getQuestionByName(name);
    return question instanceof QuestionFileModel ? question : undefined;
  }

  /**
   * Resolves the translated validation error raised by the Kendo file select
   * on a picked file.
   *
   * @param file Picked file
   * @returns Error message
   */
  private validationMessage(file: FileInfo): string {
    const error = file.validationErrors?.[0] || '';
    return this.translate.instant(KENDO_VALIDATION_MESSAGES[error] || error, {
      name: file.name,
    });
  }

  /**
   * Keeps a selection when it is one of the choices, otherwise falls back to
   * the first choice.
   *
   * @param choices Available choices
   * @param value Wanted selection
   * @returns Selection to apply
   */
  private pickChoice(
    choices: WidgetChoice[],
    value: string | null | undefined
  ): string | null {
    return choices.some((choice) => choice.value === value)
      ? (value as string)
      : choices[0]?.value ?? null;
  }

  /**
   * Reads the target file question restrictions applied to the file select.
   */
  private updateTargetRestrictions(): void {
    const target = this.targetQuestion;
    this.restrictions = target ? getKendoFileRestrictions(target) : {};
    this.accept = (target?.getPropertyValue('acceptedTypes') as string) || '';
    this.multiple = !target || !!target.allowMultiple;
  }

  /**
   * Rebuilds the rows from every file question of the survey, keeping the
   * files not stored yet: the ones uploaded when the record is saved.
   */
  private computeRows(): void {
    const rows: PendingFileRow[] = [];
    for (const question of getFileQuestions(this.survey) as QuestionFile[]) {
      const value: StoredFile[] = Array.isArray(question.value)
        ? question.value
        : [];
      const readOnly = this.disabled || question.isReadOnly;
      const fieldTitle = question.title || question.valueName || question.name;
      for (const file of value) {
        if (!file || isStoredFile(file)) {
          continue;
        }
        rows.push({
          file,
          icon: getFileIcon(file.name),
          fieldTitle,
          languageLabel: file.language
            ? getLanguageName(file.language, this.translate)
            : '',
          canRemove: !readOnly,
          removeFile: () => question.doRemoveFile(file),
        });
      }
    }
    this.rows = orderBy(rows, this.sort);
  }
}
