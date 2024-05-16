import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from '@oort-front/ui';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

/**
 * Edition of card template.
 */
@Component({
  selector: 'shared-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerModule,
    MonacoEditorModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class MonacoEditorComponent {
  /** Editor options */
  @Input() options:
    | {
        automaticLayout?: boolean;
        theme?: string;
        language?: string;
        fixedOverflowWidgets?: boolean;
      }
    | undefined;
  /** form control */
  @Input() control: any;
  /** Emit when oninit done */
  @Output() editorLoaded = new EventEmitter();
  /** editor loading */
  public loading = true;

  /**
   * Shared monaco editor component
   *
   * @param elementRef reference to the parent element
   * @param changeDetectorRef Change detector ref
   */
  constructor(
    public elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   * Sets the loading to false upon ending of loading
   *
   * @param event event fired by the monaco editor onInit
   */
  onEditorInit(event: Event) {
    this.loading = false;
    this.changeDetectorRef.detectChanges();
    this.editorLoaded.emit(event);
  }
}
