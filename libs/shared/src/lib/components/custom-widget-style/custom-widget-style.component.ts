import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  Input,
  Inject,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { debounceTime, takeUntil } from 'rxjs';
import set from 'lodash/set';
import { get } from 'lodash';
import { RestService } from '../../services/rest/rest.service';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { DOCUMENT } from '@angular/common';
import { ResizeEvent } from 'angular-resizable-element';
import { ResizableModule } from 'angular-resizable-element';

/** Default css style example to initialize the form and editor */
const DEFAULT_STYLE = '';

/** Component that allow custom styling to the widget using free scss editor */
@Component({
  selector: 'shared-custom-widget-style',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    TranslateModule,
    ButtonModule,
    TooltipModule,
    ResizableModule,
  ],
  templateUrl: './custom-widget-style.component.html',
  styleUrls: ['./custom-widget-style.component.scss'],
})
export class CustomWidgetStyleComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Form control for the scss editor */
  public formControl = new FormControl(DEFAULT_STYLE);
  /** Event emitter for cancel event */
  @Output() cancel = new EventEmitter();
  /** Editor options */
  public editorOptions = {
    automaticLayout: true,
    theme: 'vs-dark',
    language: 'scss',
    fixedOverflowWidgets: false,
  };
  /** Style applied to the widget */
  private styleApplied!: HTMLStyleElement;
  /** Loading state */
  public loading = false;

  /** Initial style */
  private initialStyle = '';

  /** Widget component */
  @Input() widgetComp: any;
  /** Save function */
  @Input() save!: (widget: any) => void;
  /** Timeout to init editor */
  private initEditorTimeoutListener!: NodeJS.Timeout;
  /** Navbar size style */
  public navbarStyle: any = {};

  /**
   * Creates an instance of CustomStyleComponent, form and updates.
   *
   * @param restService Shared rest service
   * @param translate Angular translate service
   * @param confirmService Shared confirmation service
   * @param document document
   */
  constructor(
    private restService: RestService,
    private translate: TranslateService,
    private confirmService: ConfirmService,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();

    // Avoids saving until the style is updated
    this.formControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loading = true;
      });

    // Updates the style when the value changes
    this.formControl.valueChanges
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((value: any) => {
        const scss = `#${this.widgetComp.id} {
        ${value}
      }`;
        this.restService
          .post('style/scss-to-css', { scss }, { responseType: 'text' })
          .pipe(takeUntil(this.destroy$))
          .subscribe((css) => {
            set(this.widgetComp, 'widget.settings.widgetDisplay.style', value);
            this.styleApplied.innerText = css;
            this.document
              .getElementsByTagName('head')[0]
              .appendChild(this.styleApplied);
            this.loading = false;
          });
      });
  }

  ngOnInit(): void {
    // Avoids style duplication for the same element
    const widgetStyle = Array.from(
      this.document.querySelectorAll('style')
    ).filter((style) => style.innerHTML.includes(this.widgetComp.id))[0];
    if (widgetStyle) this.styleApplied = widgetStyle;
    else this.styleApplied = this.document.createElement('style');

    const style =
      get(this.widgetComp, 'widget.settings.widgetDisplay.style') || '';
    if (style) {
      this.formControl.setValue(style);
      this.initialStyle = style;
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
            this.formControl.setValue(this.initialStyle);
            this.cancel.emit(true);
          }
        });
    }
  }

  /** Save widget custom css styling */
  async onSave(): Promise<void> {
    this.save({
      type: 'data',
      id: this.widgetComp.id,
      options: this.widgetComp.widget.settings,
    });

    this.formControl.markAsPristine();
    this.cancel.emit(true);
  }

  /**
   * On initialization of editor, format code
   *
   * @param editor monaco editor used for scss edition
   */
  public initEditor(editor: any): void {
    if (editor) {
      if (this.initEditorTimeoutListener) {
        clearTimeout(this.initEditorTimeoutListener);
      }
      this.initEditorTimeoutListener = setTimeout(() => {
        editor
          .getAction('editor.action.formatDocument')
          .run()
          .finally(() => {
            this.formControl.markAsPristine();
          });
      }, 100);
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.initEditorTimeoutListener) {
      clearTimeout(this.initEditorTimeoutListener);
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
