import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

/** Component to define the contextual filters of a widget or a map layer */
@Component({
  selector: 'safe-contextual-filters-settings',
  standalone: true,
  imports: [CommonModule, MonacoEditorModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contextual-filters-settings.component.html',
  styleUrls: ['./contextual-filters-settings.component.scss'],
})
export class ContextualFiltersSettingsComponent {
  @Input() form!: FormGroup;

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
      setTimeout(() => {
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
}
