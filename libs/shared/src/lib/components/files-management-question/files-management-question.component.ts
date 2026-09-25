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
import { File, FileService } from '../../services/file/file.service';
import { isOutdatedFile } from '../../services/file/file.utils';
import {
  getFileQuestions,
  getLanguageChoices,
  LanguageTaggedFile,
  WidgetChoice,
} from '../../survey/components/utils/files-widgets.util';
import { FilesManagementQuestion } from '../../survey/components/files-management';

/** A single row of the files management table. */
interface FileManagementRow {
  /** Underlying file object, as stored in the question's value */
  file: LanguageTaggedFile;
  /** File question the row belongs to */
  question: QuestionFileModel;
  /** Display name of that field */
  fieldTitle: string;
  /** Display label for the row's language, including the "unspecified" bucket */
  languageLabel: string;
  /** Whether the file was manually flagged as outdated */
  outdated: boolean;
}

/**
 * Rendered inside a `filesmanagement` SurveyJS question: lists every file
 * uploaded across all of the survey's file questions, filtered to two
 * languages picked for comparison, with download / remove actions.
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
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    TooltipModule,
  ],
})
export class FilesManagementQuestionComponent implements OnInit, OnDestroy {
  /** Survey owning the widget */
  @Input() survey?: SurveyModel;
  /** The `filesmanagement` question instance being rendered */
  @Input() question?: FilesManagementQuestion;

  /** Choices shared by both language dropdowns */
  public languageChoices: WidgetChoice[] = [];
  /** First language to compare */
  public languageAControl = new FormControl<string | null>(null);
  /** Second language to compare */
  public languageBControl = new FormControl<string | null>(null);
  /** Rows matching the two selected languages (plus the unspecified bucket) */
  public rows: FileManagementRow[] = [];

  /** Emits when the component is destroyed */
  private destroy$ = new Subject<void>();

  /**
   * Widget rendered inside a `filesmanagement` question.
   *
   * @param translate Angular translation service
   * @param fileService Shared file download / preview service
   */
  constructor(
    private translate: TranslateService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.languageAControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.question?.setPropertyValue('languageA', value ?? undefined);
        this.computeRows();
      });
    this.languageBControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.question?.setPropertyValue('languageB', value ?? undefined);
        this.computeRows();
      });
  }

  /**
   * (Re)computes the language choices, current selections and matching rows.
   * Called by the SurveyJS widget wiring after every render.
   */
  refresh(): void {
    this.languageChoices = getLanguageChoices(this.survey);
    const languageA =
      (this.question?.getPropertyValue('languageA') as string) ||
      this.languageChoices[0]?.value ||
      null;
    const languageB =
      (this.question?.getPropertyValue('languageB') as string) ||
      this.languageChoices[1]?.value ||
      this.languageChoices[0]?.value ||
      null;
    this.languageAControl.setValue(languageA, { emitEvent: false });
    this.languageBControl.setValue(languageB, { emitEvent: false });
    this.computeRows();
  }

  /**
   * Resolves the display text of a language code.
   *
   * @param code Language code
   * @returns Localized language name, or the code itself when unknown
   */
  private languageText(code: string): string {
    return (
      this.languageChoices.find((choice) => choice.value === code)?.text || code
    );
  }

  /**
   * Rebuilds {@link rows} from every file question of the survey, keeping
   * only files tagged with one of the two selected languages, or untagged
   * files (shown under a neutral "unspecified language" bucket).
   */
  private computeRows(): void {
    if (!this.survey) {
      this.rows = [];
      return;
    }
    const languageA = this.languageAControl.value;
    const languageB = this.languageBControl.value;
    const unspecifiedLabel = this.translate.instant(
      'components.filesManagement.unspecifiedLanguage'
    );
    const rows: FileManagementRow[] = [];
    for (const question of getFileQuestions(this.survey)) {
      const fileQuestion = question as QuestionFileModel;
      const value = fileQuestion.value as LanguageTaggedFile[] | undefined;
      if (!Array.isArray(value)) {
        continue;
      }
      for (const file of value) {
        if (!file) {
          continue;
        }
        const language = file.language;
        const matches =
          !language || language === languageA || language === languageB;
        if (!matches) {
          continue;
        }
        rows.push({
          file,
          question: fileQuestion,
          fieldTitle:
            fileQuestion.title || fileQuestion.valueName || fileQuestion.name,
          languageLabel: language
            ? this.languageText(language)
            : unspecifiedLabel,
          outdated: isOutdatedFile(file),
        });
      }
    }
    this.rows = rows;
  }

  /**
   * Downloads a row's file, reusing the same mechanism as the native file
   * question's download action so both default backend files and
   * CS-document-management files resolve correctly.
   *
   * @param row Row to download
   */
  download(row: FileManagementRow): void {
    this.fileService.download(row.file as unknown as File);
  }

  /**
   * Removes a row's file from its question's value, through the question's
   * own `removeFile`, so `onClearFiles` / the temporary storage stay in sync
   * exactly as with the native "x" button.
   *
   * @param row Row to remove
   */
  remove(row: FileManagementRow): void {
    row.question.removeFile(row.file.name);
    this.computeRows();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
