import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WIDGET_EDITOR_CONFIG } from '../../../const/tinymce.const';

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
  tileForm: FormGroup | undefined;

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
   */
  constructor(private formBuilder: FormBuilder) {}

  /**
   * Build the settings form, using the widget saved parameters.
   */
  ngOnInit(): void {
    this.tileForm = this.formBuilder.group({
      id: this.tile.id,
      title: this.tile.settings.title,
      text: this.tile.settings.text,
    });
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
