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
  BlobType,
  DownloadService,
} from '@oort-front/shared';
import { takeUntil } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ButtonModule,
  SnackbarService,
  SpinnerModule,
  TooltipModule,
} from '@oort-front/ui';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { ResizeEvent } from 'angular-resizable-element';
import { ResizableModule } from 'angular-resizable-element';
import { compileString } from 'sass';

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
    ResizableModule,
  ],
  templateUrl: './custom-style.component.html',
  styleUrls: ['./custom-style.component.scss'],
})
export class CustomStyleComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Form control */
  public formControl = new FormControl(DEFAULT_STYLE);
  /** Application id */
  public applicationId?: string;
  /** Style output */
  @Output() style = new EventEmitter<string>();
  /** Cancel output */
  @Output() cancel = new EventEmitter();
  /** Editor options */
  public editorOptions = {
    automaticLayout: true,
    theme: 'vs-dark',
    language: 'scss',
    fixedOverflowWidgets: false,
  };
  /** Raw custom style */
  private rawCustomStyle!: string;
  /** Saved style */
  private savedStyle = '';
  /** Loading state */
  public loading = false;
  /** Timeout to init editor */
  private timeoutListener!: NodeJS.Timeout;
  /** Navbar size style */
  public navbarStyle: any = {};

  /**
   * Creates an instance of CustomStyleComponent, form and updates.
   *
   * @param applicationService Shared application service
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param confirmService Shared confirmation service
   * @param document document
   * @param downloadService Shared download service
   */
  constructor(
    private applicationService: ApplicationService,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private confirmService: ConfirmService,
    @Inject(DOCUMENT) private document: Document,
    private downloadService: DownloadService
  ) {
    super();
    // Updates the style when the value changes
    this.formControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        const scss = value as string;
        // Compile to css ( we store style as scss )
        const css = compileString(scss).css;
        if (this.applicationService.customStyle) {
          this.applicationService.customStyle.innerText = css;
        }
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
      if (this.timeoutListener) {
        clearTimeout(this.timeoutListener);
      }
      this.timeoutListener = setTimeout(() => {
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
    if (this.timeoutListener) {
      clearTimeout(this.timeoutListener);
    }
    if (
      this.applicationService.customStyleEdited &&
      this.applicationService.customStyle
    ) {
      this.applicationService.customStyleEdited = false;
      this.applicationService.customStyle.innerText = this.savedStyle;
    }
  }

  /**
   * On resize action
   *
   * @param event resize event
   */
  onResizing(event: ResizeEvent): void {
    this.navbarStyle = {
      width: `${event.rectangle.width}px`,
      // height: `${event.rectangle.height}px`,
    };
  }

  /**
   * Check if resize event is valid
   *
   * @param event resize event
   * @returns boolean
   */
  validate(event: ResizeEvent): boolean {
    const dashboardNavbars =
      this.document.getElementsByTagName('shared-navbar');
    let dashboardNavbarWidth = 0;
    if (dashboardNavbars[0]) {
      if (
        (dashboardNavbars[0] as any).offsetWidth <
        this.document.documentElement.clientWidth
      ) {
        // Only if the sidenav is not horizontal
        dashboardNavbarWidth = (dashboardNavbars[0] as any).offsetWidth;
      }
    }
    // set the min width as 30% of the screen size available
    const minWidth = Math.round(
      (this.document.documentElement.clientWidth - dashboardNavbarWidth) * 0.3
    );
    // set the max width as 95% of the screen size available
    const maxWidth = Math.round(
      (this.document.documentElement.clientWidth - dashboardNavbarWidth) * 0.95
    );
    if (
      event.rectangle.width &&
      (event.rectangle.width < minWidth || event.rectangle.width > maxWidth)
    ) {
      return false;
    }
    return true;
  }
}
