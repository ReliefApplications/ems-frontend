import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ButtonModule,
  FormWrapperModule,
  SelectMenuModule,
  TooltipModule,
} from '@oort-front/ui';
import { Subject, takeUntil } from 'rxjs';
import { QuestionFileModel, SurveyModel } from 'survey-core';
import {
  checkFileRestrictions,
  getFileQuestionChoices,
  getLanguageChoices,
  WidgetChoice,
} from '../../survey/components/utils/files-widgets.util';
import { FilesUploadQuestion } from '../../survey/components/files-upload';

/** A file picked by the user, waiting to be committed to the target field. */
interface StagedFile {
  /** Native file, as picked from the input */
  file: File;
  /** Language chosen for this file at the time it was staged */
  language: string;
}

/**
 * Rendered inside a `filesupload` SurveyJS question: lets the user pick one of
 * the survey's file questions, tag files with a language and upload them to
 * it, without navigating to that field.
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
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    TooltipModule,
  ],
})
export class FilesUploadQuestionComponent implements OnInit, OnDestroy {
  /** Survey owning the widget */
  @Input() survey?: SurveyModel;
  /** The `filesupload` question instance being rendered */
  @Input() question?: FilesUploadQuestion;

  /** Choices for the target file field dropdown */
  public targetFieldChoices: WidgetChoice[] = [];
  /** Choices for the language dropdown (survey.languages, or AZURE_SUPPORTED_LANGUAGES) */
  public languageChoices: WidgetChoice[] = [];
  /** Selected target field */
  public targetFieldControl = new FormControl<string | null>(null);
  /** Selected language, applied to files staged from now on */
  public languageControl = new FormControl<string | null>(null);
  /** Files staged for upload, not yet committed to the target question */
  public stagedFiles: StagedFile[] = [];
  /** Inline validation error, shown instead of silently dropping files */
  public errorMessage = '';

  /** Emits when the component is destroyed */
  private destroy$ = new Subject<void>();

  /**
   * Widget rendered inside a `filesupload` question.
   *
   * @param translate Angular translation service
   */
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.targetFieldControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.question?.setPropertyValue('targetField', value ?? undefined);
        this.errorMessage = '';
      });
    this.languageControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.question?.setPropertyValue('language', value ?? undefined);
      });
  }

  /**
   * (Re)computes the dropdown choices and current selections from the survey
   * / question. Called by the SurveyJS widget wiring after every render.
   */
  refresh(): void {
    this.targetFieldChoices = getFileQuestionChoices(this.survey);
    this.languageChoices = getLanguageChoices(this.survey);

    const targetField =
      (this.question?.getPropertyValue('targetField') as string) ||
      this.targetFieldChoices[0]?.value ||
      null;
    const language =
      (this.question?.getPropertyValue('language') as string) ||
      this.languageChoices[0]?.value ||
      null;
    this.targetFieldControl.setValue(targetField, { emitEvent: false });
    this.languageControl.setValue(language, { emitEvent: false });
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
    return this.survey.getQuestionByName(name) as QuestionFileModel | undefined;
  }

  /**
   * Stages the files picked from the native file input, after validating them
   * against the target question's restrictions.
   *
   * @param event Change event fired by the hidden file input
   */
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    input.value = '';
    if (!files.length) {
      return;
    }
    this.errorMessage = '';
    const targetQuestion = this.targetQuestion;
    if (!targetQuestion) {
      this.errorMessage = this.translate.instant(
        'components.filesUpload.errors.noTargetField'
      );
      return;
    }
    const existingCount =
      (targetQuestion.value?.length || 0) + this.stagedFiles.length;
    const error = checkFileRestrictions(targetQuestion, existingCount, files);
    if (error) {
      this.errorMessage = this.translate.instant(error.key, error.params);
      return;
    }
    const language =
      this.languageControl.value || this.languageChoices[0]?.value || '';
    files.forEach((file) => this.stagedFiles.push({ file, language }));
  }

  /**
   * Removes a staged file before it is committed to the target question.
   *
   * @param index Index in {@link stagedFiles}
   */
  removeStagedFile(index: number): void {
    this.stagedFiles.splice(index, 1);
  }

  /**
   * Resolves a display label for a staged file's mime/extension.
   *
   * @param file Staged native file
   * @returns Mime type, or extension when the mime type is unknown
   */
  getFileType(file: File): string {
    return file.type || file.name.split('.').pop() || '';
  }

  /**
   * Resolves the display text of a language code.
   *
   * @param code Language code
   * @returns Localized language name, or the code itself when unknown
   */
  languageText(code: string): string {
    return (
      this.languageChoices.find((choice) => choice.value === code)?.text || code
    );
  }

  /**
   * Commits every staged file to the target file question's value, tagging
   * each with its chosen language, then feeds them through the same
   * `survey.uploadFiles` flow the native file question uses - so
   * `temporaryFilesStorage` / the save pipeline picks them up unchanged.
   */
  confirmUpload(): void {
    const targetQuestion = this.targetQuestion;
    if (!targetQuestion || !this.stagedFiles.length || !this.survey) {
      return;
    }
    const staged = [...this.stagedFiles];
    const filesToUpload = staged.map((entry) => entry.file);
    const languageByFile = new Map(
      staged.map((entry) => [entry.file, entry.language])
    );

    const doUpload = () => {
      this.survey?.uploadFiles(
        targetQuestion,
        targetQuestion.name,
        filesToUpload,
        (status: string, data?: { file: File; content: unknown }[]) => {
          if (status !== 'success') {
            this.errorMessage = this.translate.instant(
              'components.filesUpload.errors.uploadFailed'
            );
            return;
          }
          const additions = (data || []).map((result) => ({
            name: result.file.name,
            type: result.file.type,
            content: result.content,
            language: languageByFile.get(result.file) || '',
          }));
          targetQuestion.value = (targetQuestion.value || []).concat(additions);
          this.stagedFiles = this.stagedFiles.filter(
            (entry) => !staged.includes(entry)
          );
        }
      );
    };

    // Mirrors QuestionFileModel.loadFiles: a single-file question clears its
    // previous value (and the temporary storage entry) before loading anew.
    if (!targetQuestion.getPropertyValue('allowMultiple')) {
      targetQuestion.clear(doUpload);
    } else {
      doUpload();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
