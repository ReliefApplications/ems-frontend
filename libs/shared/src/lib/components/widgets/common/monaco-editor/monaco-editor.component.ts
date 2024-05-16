import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
export class MonacoEditorComponent implements OnInit {
  /** Editor options */
  @Input() options:
    | {
        automaticLayout?: boolean;
        theme?: string;
        language?: string;
        fixedOverflowWidgets?: boolean;
      }
    | undefined = {};
  /** form control */
  @Input() control: any = new FormControl();
  /** parent class */
  public parentClass = '';
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
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.parentClass = this.elementRef.nativeElement.className;
  }

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
