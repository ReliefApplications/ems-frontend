import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { WIDGET_EDITOR_CONFIG } from '../../../const/tinymce.const';
import { SafeEditorService } from '../../../services/editor/editor.service';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';

/**
 * Modal content for the settings of the editor widgets.
 */
@Component({
  selector: 'safe-editor-settings',
  templateUrl: './editor-settings.component.html',
  styleUrls: ['./editor-settings.component.scss'],
})
export class SafeEditorSettingsComponent implements OnInit, AfterViewInit {
  // === REACTIVE FORM ===
  tileForm: UntypedFormGroup | undefined;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  /** tinymce editor */
  public editor: any = WIDGET_EDITOR_CONFIG;

  /**
   * Modal content for the settings of the editor widgets.
   *
   * @param formBuilder Angular Form Builder
   * @param editorService Editor service used to get main URL and current language
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private editorService: SafeEditorService
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  /**
   * Build the settings form, using the widget saved parameters.
   */
  ngOnInit(): void {
    const form = this.formBuilder.group({
      id: this.tile.id,
      title: this.tile.settings.title,
      text: this.tile.settings.text,
    });
    this.tileForm = extendWidgetForm(form, this.tile?.settings?.widgetDisplay);
    this.change.emit(this.tileForm);
  }

  /**
   * Detect the form changes to emit the new configuration.
   */
  ngAfterViewInit(): void {
    this.tileForm?.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });
  }
}
