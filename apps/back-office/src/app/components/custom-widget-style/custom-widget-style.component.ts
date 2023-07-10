import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import {
  SafeUnsubscribeComponent,
  SafeLayoutService,
  SafeConfirmService,
} from '@oort-front/safe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule, SnackbarService, SpinnerModule } from '@oort-front/ui';
import { SafeRestService } from 'libs/safe/src/lib/services/rest/rest.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

/** Default css style example to initialize the form and editor */
const DEFAULT_STYLE = '';

/** Component that allow custom styling to the widget using free scss editor */
@Component({
  selector: 'app-custom-widget-style',
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
  templateUrl: './custom-widget-style.component.html',
  styleUrls: ['./custom-widget-style.component.scss'],
})
export class CustomWidgetStyleComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  public formControl = new FormControl(DEFAULT_STYLE);
  @Output() style = new EventEmitter<string>();
  @Output() cancel = new EventEmitter();
  public editorOptions = {
    theme: 'vs-dark',
    language: 'scss',
    fixedOverflowWidgets: true,
  };
  private styleApplied: HTMLStyleElement;
  public loading = false;

  /**
   * Creates an instance of CustomStyleComponent, form and updates.
   *
   * @param layoutService Shared layout service
   * @param snackBar Shared snackbar service
   * @param restService Shared rest service
   * @param translate Angular translate service
   * @param confirmService Shared confirmation service
   */
  constructor(
    private layoutService: SafeLayoutService,
    private restService: SafeRestService,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private confirmService: SafeConfirmService
  ) {
    super();
    this.styleApplied = document.createElement('style');
    // Updates the style when the value changes
    this.formControl.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: any) => {
        const scss = `#${this.layoutService.currentWidgetStyle.id} {
        ${value}
      }`;

        this.restService
          .post('style/scss-to-css', { scss }, { responseType: 'text' })
          .subscribe((css) => {
            this.styleApplied.innerText = css;
            document
              .getElementsByTagName('head')[0]
              .appendChild(this.styleApplied);
            this.style.emit(value);
          });
      });
  }

  ngOnInit(): void {
    if (this.layoutService.currentWidgetStyle.style) {
      this.formControl.setValue(this.layoutService.currentWidgetStyle.style);
      this.formControl.markAsPristine();
    }
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
            this.formControl.setValue(
              this.layoutService.currentWidgetStyle.style
            );
            this.cancel.emit(true);
          }
        });
    }
  }

  /** Save widget custom css styling */
  async onSave(): Promise<void> {
    this.loading = true;
    // const res = await firstValueFrom(
    //   this.apollo.mutate<UploadApplicationStyleMutationResponse>({
    //     mutation: UPLOAD_APPLICATION_STYLE,
    //     variables: {
    //       file,
    //       application: this.applicationId,
    //     },
    //     context: {
    //       useMultipart: true,
    //     },
    //   })
    // );
    // if (res.errors) {
    //   this.snackBar.openSnackBar(res.errors[0].message, { error: true });
    //   return;
    // } else {
    //   this.snackBar.openSnackBar(
    //     this.translate.instant('common.notifications.objectUpdated', {
    //       value: this.translate.instant('components.application.customStyling'),
    //       type: '',
    //     })
    //   );
    //   this.formControl.markAsPristine();
    // }
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
          });
      }, 100);
    }
  }
}
