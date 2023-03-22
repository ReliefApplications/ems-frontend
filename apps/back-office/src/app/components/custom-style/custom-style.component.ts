import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { SafeButtonModule } from '@oort-front/safe';
import { SafeApplicationService } from '@oort-front/safe';

/** Default css style example to initialize the form and editor */
const DEFAULT_STYLE = 'app-application {\n    color: red !important;\n}';

@Component({
  selector: 'app-custom-style',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    SafeButtonModule,
  ],
  templateUrl: './custom-style.component.html',
  styleUrls: ['./custom-style.component.scss'],
})

/** Component that allow custom styling to the application using free scss editor */
export class CustomStyleComponent {
  public formControl = new FormControl(DEFAULT_STYLE);
  @Output() style = new EventEmitter<string>();
  @Output() cancel = new EventEmitter();
  public editorOptions = {
    theme: 'vs-dark',
    language: 'scss',
    fixedOverflowWidgets: true,
  };
  private styleApplied: HTMLStyleElement;

  /**
   * Creates an instance of CustomStyleComponent, form and updates.
   *
   * @param applicationService Shared application service
   */
  constructor(private applicationService: SafeApplicationService) {
    this.styleApplied = document.createElement('style');
    this.applicationService.customStyle = this.styleApplied;
    // Updates the style when the value changes
    this.formControl.valueChanges.subscribe((value: any) => {
      this.styleApplied.innerText = value;
      document.getElementsByTagName('body')[0].appendChild(this.styleApplied);
      this.style.emit(value);
    });
  }

  /** When clicking on the close button */
  onClose(): void {
    this.cancel.emit(true);
  }
}
