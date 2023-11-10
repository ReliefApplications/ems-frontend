import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import {
  Application,
  SafeApplicationService,
  SafeUnsubscribeComponent,
  SafeConfirmService,
  SafeDownloadService,
  BlobType,
} from '@oort-front/safe';
import { takeUntil } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule, SnackbarService } from '@oort-front/ui';

/** Default css style example to initialize the form and editor */
const DEFAULT_STYLE = '';

/** Component that allow custom styling to the application using free scss editor */
@Component({
  selector: 'app-custom-style',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    TranslateModule,
    ButtonModule,
  ],
  templateUrl: './custom-style.component.html',
  styleUrls: ['./custom-style.component.scss'],
})
export class CustomStyleComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  public formControl = new FormControl(DEFAULT_STYLE);
  public applicationId?: string;
  @Output() style = new EventEmitter<string>();
  @Output() cancel = new EventEmitter();
  public editorOptions = {
    theme: 'vs-dark',
    language: 'scss',
    fixedOverflowWidgets: false,
  };
  private styleApplied: HTMLStyleElement;
  private savedStyle = '';

  /**
   * Creates an instance of CustomStyleComponent, form and updates.
   *
   * @param applicationService Shared application service
   * @param snackBar Shared snackbar service
   * @param apollo Apollo service
   * @param translate Angular translate service
   * @param confirmService Shared confirmation service
   * @param downloadService Shared download service
   */
  constructor(
    private applicationService: SafeApplicationService,
    private snackBar: SnackbarService,
    private apollo: Apollo,
    private translate: TranslateService,
    private confirmService: SafeConfirmService,
    private downloadService: SafeDownloadService
  ) {
    super();
    this.styleApplied = document.createElement('style');
    // Updates the style when the value changes
    this.formControl.valueChanges.subscribe((value: any) => {
      this.applicationService.customStyleEdited = true;
      this.styleApplied.innerText = value;
      document.getElementsByTagName('body')[0].appendChild(this.styleApplied);
      this.style.emit(value);
    });
  }

  ngOnInit(): void {
    if (this.applicationService.customStyle) {
      this.savedStyle = this.applicationService.customStyle.innerText;
      this.styleApplied = this.applicationService.customStyle;
      this.formControl.setValue(this.styleApplied.innerText);
      this.formControl.markAsPristine();
    } else {
      this.applicationService.customStyle = this.styleApplied;
    }

    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.applicationId = application.id;
        }
      });
  }

  /** When clicking on the close button */
  onClose(): void {
    if (this.formControl.pristine) {
      this.cancel.emit(true);
    } else {
      /** If not saved changes, confirm before close */
      const confirmDialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('components.form.update.exit'),
        content: this.translate.instant(
          'components.widget.settings.close.confirmationMessage'
        ),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmVariant: 'danger',
      });
      confirmDialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((confirm: any) => {
          if (confirm) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.applicationService.customStyle!.innerText = this.savedStyle;
            this.cancel.emit(true);
          }
        });
    }
  }

  /** Save application custom css styling */
  async onSave(): Promise<void> {
    if (!this.applicationId) {
      throw new Error('No application id');
    }

    const file = new File(
      [this.formControl.value as string],
      'customStyle.scss',
      {
        type: 'scss',
      }
    );

    await this.downloadService.uploadBlob(
      file,
      BlobType.APPLICATION_STYLE,
      this.applicationId
    );

    this.snackBar.openSnackBar(
      this.translate.instant('common.notifications.objectUpdated', {
        value: this.translate.instant('components.application.customStyling'),
        type: '',
      })
    );
    this.formControl.markAsPristine();
    this.applicationService.customStyleEdited = false;
    this.applicationService.customStyle = this.styleApplied;
  }

  /**
   * On initialization of editor, format code
   *
   * @param editor monaco editor used for scss edition
   */
  public initEditor(editor: any): void {
    if (editor) {
      setTimeout(() => {
        editor
          .getAction('editor.action.formatDocument')
          .run()
          .finally(() => {
            this.formControl.markAsPristine();
            this.applicationService.customStyleEdited = false;
          });
      }, 100);
    }
  }
}
