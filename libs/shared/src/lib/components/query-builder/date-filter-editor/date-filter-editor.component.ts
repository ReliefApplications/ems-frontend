import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { isDate } from 'lodash';
import { INLINE_EDITOR_CONFIG } from '../../../const/tinymce.const';
import { EditorService } from '../../../services/editor/editor.service';

/**
 * Template of custom date edition, for filtering.
 */
@Component({
  selector: 'shared-date-filter-editor',
  templateUrl: './date-filter-editor.component.html',
  styleUrls: ['./date-filter-editor.component.scss'],
})
export class DateFilterEditorComponent implements OnInit {
  /** Date filter control */
  @Input() control!: UntypedFormControl;
  /** Is using expression */
  public useExpression = false;
  /** Tinymce editor configuration */
  public editorTinymce: any = INLINE_EDITOR_CONFIG;

  /** @returns Is the first input a date or not. */
  get isDate(): boolean {
    const value = this.control.value;
    if (value.includes('{{')) {
      return false;
    }
    const dateValue = new Date(value);
    if (
      isDate(value) ||
      (isDate(dateValue) && dateValue.toISOString() === value)
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Date filter component to build filters for dates questions
   *
   * @param editorService tinymce editor service
   */
  constructor(private editorService: EditorService) {
    // Set the editor base url based on the environment file
    this.editorTinymce.base_url = editorService.url;
    // Set the editor language
    this.editorTinymce.language = editorService.language;
  }

  ngOnInit(): void {
    this.useExpression = !this.isDate;
    this.editorService.addCalcAndKeysAutoCompleter(this.editorTinymce, [
      {
        value: '{{today}}',
        text: '{{today}}',
      },
      {
        value: '{{now}}',
        text: '{{now}}',
      },
    ]);
  }

  /**
   * Update type of editor.
   */
  public changeEditor(): void {
    this.control.setValue(null);
    this.useExpression = !this.useExpression;
  }
}
