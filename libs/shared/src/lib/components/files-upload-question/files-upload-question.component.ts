import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LabelModule } from '@progress/kendo-angular-label';
import {
  FileInfo,
  FileRestrictions,
  FileSelectComponent,
  RemoveEvent,
  SelectEvent,
  UploadsModule,
} from '@progress/kendo-angular-upload';
import { Subject, takeUntil } from 'rxjs';
import { QuestionFileModel, SurveyModel } from 'survey-core';
import { File as StoredFile } from '../../services/file/file.service';
import { FilesUploadQuestion } from '../../survey/components/files-upload';
import {
  checkFileRestrictions,
  getFileQuestionChoices,
  getKendoFileRestrictions,
  getLanguageChoices,
  getLanguageText,
  WidgetChoice,
} from '../../survey/components/utils/files-widgets.util';

/** Translation keys of the validation errors raised by the Kendo file select. */
const KENDO_VALIDATION_MESSAGES: Record<string, string> = {
  invalidFileExtension: 'components.filesUpload.errors.invalidExtension',
  invalidMaxFileSize: 'components.filesUpload.errors.fileTooLarge',
};

/**
 * Rendered inside a Files upload SurveyJS question: lets the user pick one of
 * the survey's file questions, tag files with a language and upload them to
 * it, without navigating to that question.
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
    ButtonsModule,
    DropDownsModule,
    LabelModule,
    UploadsModule,
  ],
})
export class FilesUploadQuestionComponent implements OnInit, OnDestroy {
  /** Survey owning the question */
  @Input() survey?: SurveyModel;
  /** The Files upload question instance being rendered */
  @Input() question?: FilesUploadQuestion;
  /** Kendo file select holding the staged files */
  @ViewChild(FileSelectComponent) fileSelect?: FileSelectComponent;

  /** Choices of the target file question dropdown */
  public targetFieldChoices: WidgetChoice[] = [];
  /** Choices of the language dropdown ( languages of the form ) */
  public languageChoices: WidgetChoice[] = [];
  /** Selected target file question */
  public targetFieldControl = new FormControl<string | null>(null);
  /** Selected language, applied to the files staged from now on */
  public languageControl = new FormControl<string | null>(null);
  /** Kendo restrictions of the target file question */
  public restrictions: FileRestrictions = {};
  /** Native file input filter of the target file question */
  public accept = '';
  /** Whether the target file question accepts several files */
  public multiple = true;
  /** Whether the question cannot be used ( form builder, read-only survey ) */
  public disabled = false;
  /** Inline validation error, shown instead of silently dropping files */
  public errorMessage = '';
  /** Files staged in the file select, not yet uploaded to the target question */
  public staged: FileInfo[] = [];

  /** Language of each staged file, by Kendo file uid */
  private languageByUid = new Map<string, string>();
  /** Emits when the component is destroyed */
  private destroy$ = new Subject<void>();

  /**
   * Rendered inside a Files upload SurveyJS question.
   *
   * @param translate Angular translation service
   * @param cdr Change detector of the component
   */
  constructor(
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.targetFieldControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Staged files were validated against the previous target
        this.updateTargetRestrictions();
        this.resetStaged();
      });
  }

  /**
   * (Re)computes the dropdown choices, the selections and the restrictions
   * from the survey / question. Called by the SurveyJS question after every
   * render.
   */
  refresh(): void {
    this.targetFieldChoices = getFileQuestionChoices(this.survey);
    this.languageChoices = getLanguageChoices(this.survey);
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
  }

  /**
   * Staged files accepted by the Kendo restrictions, the only ones uploaded.
   *
   * @returns Valid staged files
   */
  get validStaged(): FileInfo[] {
    return this.staged.filter(
      (file) => !file.validationErrors?.length && !!file.rawFile
    );
  }

  /**
   * Stages the files picked in the file select, unless they violate the
   * target question's restrictions ( number of files, accepted types ). Kendo
   * flags size / extension violations on the files themselves.
   *
   * @param event Kendo select event
   */
  onSelect(event: SelectEvent): void {
    const target = this.targetQuestion;
    if (!target) {
      event.preventDefault();
      this.errorMessage = this.translate.instant(
        'components.filesUpload.errors.noTargetField'
      );
      return;
    }
    const incoming = event.files
      .filter((file) => !file.validationErrors?.length && !!file.rawFile)
      .map((file) => file.rawFile as File);
    const existingCount =
      (Array.isArray(target.value) ? target.value.length : 0) +
      this.validStaged.length;
    const error = checkFileRestrictions(target, existingCount, incoming);
    if (error) {
      event.preventDefault();
      this.errorMessage = this.translate.instant(error.key, error.params);
      return;
    }
    this.errorMessage = '';
    const language = this.languageControl.value || '';
    event.files.forEach((file) => {
      if (file.uid) {
        this.languageByUid.set(file.uid, language);
      }
    });
    this.staged = this.staged.concat(event.files);
  }

  /**
   * Forgets files removed from the file select.
   *
   * @param event Kendo remove event
   */
  onRemove(event: RemoveEvent): void {
    const removed = new Set(event.files.map((file) => file.uid));
    removed.forEach((uid) => uid && this.languageByUid.delete(uid));
    this.staged = this.staged.filter((file) => !removed.has(file.uid));
    this.errorMessage = '';
  }

  /**
   * Resolves the display text of a staged file's language.
   *
   * @param file Staged file
   * @returns Language name
   */
  languageOf(file: FileInfo): string {
    const code = (file.uid && this.languageByUid.get(file.uid)) || '';
    return code
      ? getLanguageText(code)
      : this.translate.instant(
          'components.filesManagement.unspecifiedLanguage'
        );
  }

  /**
   * Resolves the translated validation error of a staged file, if any.
   *
   * @param file Staged file
   * @returns Error message, or empty string when the file is valid
   */
  validationMessage(file: FileInfo): string {
    const error = file.validationErrors?.[0];
    return error
      ? this.translate.instant(KENDO_VALIDATION_MESSAGES[error] || error)
      : '';
  }

  /**
   * Uploads every valid staged file to the target file question, tagged with
   * its language, through the same `survey.uploadFiles` flow the native file
   * question uses, so the temporary files storage / save pipeline picks them
   * up unchanged.
   */
  confirmUpload(): void {
    const target = this.targetQuestion;
    const files = this.validStaged;
    if (!target || !files.length || !this.survey || this.disabled) {
      return;
    }
    const languageByFile = new Map<File, string>(
      files.map((file) => [
        file.rawFile as File,
        (file.uid && this.languageByUid.get(file.uid)) || '',
      ])
    );
    const doUpload = () => {
      this.survey?.uploadFiles(
        target,
        target.name,
        Array.from(languageByFile.keys()),
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
            language: languageByFile.get(result.file) || undefined,
          }));
          const current: StoredFile[] = Array.isArray(target.value)
            ? target.value
            : [];
          target.value = current.concat(additions);
          this.resetStaged();
          this.cdr.detectChanges();
        }
      );
    };
    // Mirrors QuestionFileModel.loadFiles: a single-file question clears its
    // previous value ( and the temporary storage entry ) before loading anew.
    if (!target.allowMultiple) {
      target.clear(doUpload);
    } else {
      doUpload();
    }
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

  /** Empties the file select and the staged files. */
  private resetStaged(): void {
    this.fileSelect?.clearFiles();
    this.staged = [];
    this.languageByUid.clear();
    this.errorMessage = '';
  }
}
