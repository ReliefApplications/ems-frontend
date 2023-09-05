import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from '@oort-front/ui';
import { debounceTime, takeUntil } from 'rxjs';
import set from 'lodash/set';
import get from 'lodash/get';
import { SafeRestService } from '../../services/rest/rest.service';
import { SafeConfirmService } from '../../services/confirm/confirm.service';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';

/** Default css style example to initialize the form and editor */
const DEFAULT_STYLE = '';

/** Component that allow custom styling to the widget using free scss editor */
@Component({
  selector: 'safe-custom-widget-style',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    TranslateModule,
    ButtonModule,
  ],
  templateUrl: './custom-widget-style.component.html',
  styleUrls: ['./custom-widget-style.component.scss'],
})
export class CustomWidgetStyleComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  public formControl = new FormControl(DEFAULT_STYLE);
  @Output() cancel = new EventEmitter();
  public editorOptions = {
    theme: 'vs-dark',
    language: 'scss',
    fixedOverflowWidgets: false,
  };
  private styleApplied!: HTMLStyleElement;
  public loading = false;

  private initialStyle = '';

  @Input() widgetComp: any;
  @Input() save!: (tile: any) => void;

  /**
   * Creates an instance of CustomStyleComponent, form and updates.
   *
   * @param restService Shared rest service
   * @param translate Angular translate service
   * @param confirmService Shared confirmation service
   */
  constructor(
    private restService: SafeRestService,
    private translate: TranslateService,
    private confirmService: SafeConfirmService
  ) {
    super();

    // Avoids saving until the style is updated
    this.formControl.valueChanges.subscribe(() => {
      this.loading = true;
    });

    // Updates the style when the value changes
    this.formControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((value: any) => {
        const scss = `#${this.widgetComp.domId} {
        ${value}
      }`;
        this.restService
          .post('style/scss-to-css', { scss }, { responseType: 'text' })
          .subscribe((css) => {
            set(this.widgetComp, 'widget.settings.widgetDisplay.style', value);
            this.styleApplied.innerText = css;
            document
              .getElementsByTagName('head')[0]
              .appendChild(this.styleApplied);
            this.loading = false;
          });
      });
  }

  ngOnInit(): void {
    // Avoids style duplication for the same element
    const widgetStyle = Array.from(document.querySelectorAll('style')).filter(
      (style) => style.innerHTML.includes(this.widgetComp.domId)
    )[0];
    if (widgetStyle) this.styleApplied = widgetStyle;
    else this.styleApplied = document.createElement('style');

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
      id: this.widgetComp.widget.id,
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
