import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import {
  Application,
  SafeApplicationService,
  SafeUnsubscribeComponent,
  SafeConfirmService,
  SafeRestService,
} from '@oort-front/safe';
import { firstValueFrom } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { UploadApplicationStyleMutationResponse } from './graphql/mutations';
import { UPLOAD_APPLICATION_STYLE } from './graphql/mutations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule, SnackbarService, SpinnerModule } from '@oort-front/ui';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  ],
  templateUrl: './custom-style.component.html',
  styleUrls: ['./custom-style.component.scss'],
})
export class CustomStyleComponent
  extends SafeUnsubscribeComponent
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
   */
  constructor(
    private applicationService: SafeApplicationService,
    private snackBar: SnackbarService,
    private apollo: Apollo,
    private translate: TranslateService,
    private confirmService: SafeConfirmService,
    private restService: SafeRestService
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
      const styleElement = document.createElement('style');
      styleElement.innerText = '';
      document.getElementsByTagName('head')[0].appendChild(styleElement);
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
    this.loading = true;

    const file = new File(
      [this.formControl.value as string],
      'customStyle.scss',
      {
        type: 'scss',
      }
    );

    const res = await firstValueFrom(
      this.apollo.mutate<UploadApplicationStyleMutationResponse>({
        mutation: UPLOAD_APPLICATION_STYLE,
        variables: {
          file,
          application: this.applicationId,
        },
        context: {
          useMultipart: true,
        },
      })
    );
    if (res.errors) {
      this.snackBar.openSnackBar(res.errors[0].message, { error: true });
      return;
    } else {
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
