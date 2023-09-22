import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  Inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import {
  Application,
  ApplicationService,
  UnsubscribeComponent,
  ConfirmService,
  RestService,
  BlobType,
  DownloadService,
} from '@oort-front/shared';
import { takeUntil } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ButtonModule,
  SnackbarService,
  SpinnerModule,
  TooltipModule,
} from '@oort-front/ui';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

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
    SpinnerModule,
    TooltipModule,
  ],
  templateUrl: './custom-style.component.html',
  styleUrls: ['./custom-style.component.scss'],
})
export class CustomStyleComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
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
  private rawCustomStyle!: string;
  private savedStyle = '';
  public loading = false;

  /**
   * Creates an instance of CustomStyleComponent, form and updates.
   *
   * @param applicationService Shared application service
   * @param snackBar Shared snackbar service
   * @param apollo Apollo service
   * @param translate Angular translate service
   * @param confirmService Shared confirmation service
   * @param restService Shared rest service
   * @param document document
   * @param downloadService Shared download service
   */
  constructor(
    private applicationService: ApplicationService,
    private snackBar: SnackbarService,
    private apollo: Apollo,
    private translate: TranslateService,
    private confirmService: ConfirmService,
    private restService: RestService,
    @Inject(DOCUMENT) private document: Document,
    private downloadService: DownloadService
  ) {
    super();
    // Updates the style when the value changes
    this.formControl.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: any) => {
        const scss = value as string;
        this.restService
          .post('style/scss-to-css', { scss }, { responseType: 'text' })
          .subscribe({
            next: (css) => {
              if (this.applicationService.customStyle) {
                this.applicationService.customStyle.innerText = css;
              }
            },
          });
        this.applicationService.customStyleEdited = true;
        this.rawCustomStyle = value;
      });
  }

  ngOnInit(): void {
    if (this.applicationService.rawCustomStyle) {
      this.savedStyle = this.applicationService.customStyle?.innerText || '';
      this.rawCustomStyle = this.applicationService.rawCustomStyle;
      this.formControl.setValue(this.rawCustomStyle, { emitEvent: false });
      this.formControl.markAsPristine();
    } else {
      const styleElement = this.document.createElement('style');
      styleElement.innerText = '';
      this.document.getElementsByTagName('head')[0].appendChild(styleElement);
      this.applicationService.rawCustomStyle = this.rawCustomStyle;
      this.applicationService.customStyle = styleElement;
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

            if (this.applicationService.customStyle) {
              this.applicationService.customStyleEdited = false;
              this.applicationService.customStyle.innerText = this.savedStyle;
            }
            this.cancel.emit(true);
          }
        });
    }
  }

  /** Save application custom css styling */
  async onSave(): Promise<void> {
    // todo(beta): check
    this.loading = true;
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

    const path = await this.downloadService.uploadBlob(
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
    // todo(beta): check
    if (path) {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectUpdated', {
          value: this.translate.instant('components.application.customStyling'),
          type: '',
        })
      );
      this.formControl.markAsPristine();
      this.applicationService.customStyleEdited = false;
      this.applicationService.rawCustomStyle = this.rawCustomStyle;
      this.savedStyle = this.applicationService.customStyle?.innerText || '';
    }
    this.loading = false;
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (
      this.applicationService.customStyleEdited &&
      this.applicationService.customStyle
    ) {
      this.applicationService.customStyleEdited = false;
      this.applicationService.customStyle.innerText = this.savedStyle;
    }
  }
}
