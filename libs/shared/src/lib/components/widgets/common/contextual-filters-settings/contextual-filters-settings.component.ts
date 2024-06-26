import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormWrapperModule, IconModule, TooltipModule } from '@oort-front/ui';
import { AsyncMonacoEditorDirective } from '../../../../directives/async-monaco-editor/async-monaco-editor.directive';

/** Component to define the contextual filters of a widget or a map layer */
@Component({
  selector: 'shared-contextual-filters-settings',
  standalone: true,
  imports: [
    CommonModule,
    MonacoEditorModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
    IconModule,
    TooltipModule,
    AsyncMonacoEditorDirective,
  ],
  templateUrl: './contextual-filters-settings.component.html',
  styleUrls: ['./contextual-filters-settings.component.scss'],
})
export class ContextualFiltersSettingsComponent implements OnDestroy {
  /**
   * Form group
   */
  @Input() form!: FormGroup;
  /** Timeout to init editor */
  private initEditorTimeoutListener!: NodeJS.Timeout;

  /**
   * Editor options
   */
  public editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    fixedOverflowWidgets: true,
  };

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
            const control = this.form.get('dashboardFilters');
            control?.markAsPristine();
          });
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.initEditorTimeoutListener) {
      clearTimeout(this.initEditorTimeoutListener);
    }
  }
}
