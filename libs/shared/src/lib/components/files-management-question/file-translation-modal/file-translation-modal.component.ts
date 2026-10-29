import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LabelModule } from '@progress/kendo-angular-label';
import {
  FileInfo,
  FileRestrictions,
  SelectEvent,
  UploadsModule,
} from '@progress/kendo-angular-upload';
import { QuestionFileModel } from 'survey-core';
import { File as StoredFile } from '../../../services/file/file.service';
import {
  checkFileRestrictions,
  getKendoFileRestrictions,
  WidgetChoice,
} from '../../../survey/components/utils/files-widgets.util';

/** Translation keys of the validation errors raised by the Kendo file select. */
const KENDO_VALIDATION_MESSAGES: Record<string, string> = {
  invalidFileExtension: 'components.filesUpload.errors.invalidType',
  invalidMaxFileSize: 'components.filesUpload.errors.maxSizeExceeded',
};

/** Data given to the file translation modal. */
export interface FileTranslationDialogData {
  /** File being translated */
  file: StoredFile;
  /** File question holding the file, which receives the translation */
  question: QuestionFileModel;
  /** Languages the file can be translated into */
  languages: WidgetChoice[];
  /** Number of files already held by the question ( stored + staged ) */
  existingCount: number;
}

/** Result of the file translation modal, when confirmed. */
export interface FileTranslationResult {
  /** Language of the translation */
  language: string;
  /** Picked translated file */
  file: globalThis.File;
}

/**
 * Modal picking the translation of a file listed by a Files management
 * question: the language it is translated into, among the ones the file
 * misses, and the translated file, validated against the restrictions of the
 * file question holding the translated file ( accepted types, maximum size,
 * number of files ).
 */
@Component({
  standalone: true,
  selector: 'shared-file-translation-modal',
  templateUrl: './file-translation-modal.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    DropDownsModule,
    LabelModule,
    UploadsModule,
  ],
})
export class FileTranslationModalComponent {
  /** Selected translation language */
  public languageControl = new FormControl<string | null>(null);
  /** Kendo restrictions of the file question */
  public restrictions: FileRestrictions = {};
  /** Native file input filter of the file question */
  public accept = '';
  /** Picked translated file, once valid */
  public file?: globalThis.File;
  /** Last validation error */
  public errorMessage = '';

  /**
   * Modal picking the translation of a file.
   *
   * @param data Dialog data
   * @param dialogRef Dialog reference
   * @param translate Angular translation service
   */
  constructor(
    @Inject(DIALOG_DATA) public data: FileTranslationDialogData,
    private dialogRef: DialogRef<FileTranslationResult | undefined>,
    private translate: TranslateService
  ) {
    this.languageControl.setValue(data.languages[0]?.value ?? null);
    this.restrictions = getKendoFileRestrictions(data.question);
    this.accept =
      (data.question.getPropertyValue('acceptedTypes') as string) || '';
  }

  /**
   * Keeps the picked file when it satisfies the restrictions of the file
   * question, otherwise rejects it with an error message.
   *
   * @param event Kendo select event
   */
  onSelect(event: SelectEvent): void {
    const picked = event.files[0];
    const raw = picked?.rawFile;
    if (!picked || !raw) {
      return;
    }
    const error = picked.validationErrors?.length
      ? this.validationMessage(picked)
      : this.restrictionMessage(raw);
    if (error) {
      event.preventDefault();
      this.file = undefined;
      this.errorMessage = error;
      return;
    }
    this.file = raw;
    this.errorMessage = '';
  }

  /**
   * Forgets the picked file when it is removed from the file select.
   */
  onRemove(): void {
    this.file = undefined;
  }

  /**
   * Closes the modal with the picked translation.
   */
  onConfirm(): void {
    const language = this.languageControl.value;
    if (!this.file || !language) {
      return;
    }
    this.dialogRef.close({ language, file: this.file });
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
   * Checks the restrictions of the file question not covered by the Kendo
   * file select ( number of files, accepted mime types ).
   *
   * @param file Picked file
   * @returns Error message, empty when the file is accepted
   */
  private restrictionMessage(file: globalThis.File): string {
    const error = checkFileRestrictions(
      this.data.question,
      this.data.existingCount,
      [file]
    );
    return error ? this.translate.instant(error.key, error.params) : '';
  }
}
