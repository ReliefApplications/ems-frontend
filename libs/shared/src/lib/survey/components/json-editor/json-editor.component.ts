import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { QuestionAngular } from 'survey-angular-ui';
import { JSONEditorModel } from './json-editor.model';
import { AsyncMonacoEditorDirective } from '../../../directives/async-monaco-editor/async-monaco-editor.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * JSON editor component for Form Builder.
 * Enables to use Monaco Editor as property.
 */
@Component({
  selector: 'shared-json-editor',
  standalone: true,
  imports: [
    CommonModule,
    MonacoEditorModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncMonacoEditorDirective,
  ],
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss'],
})
export class JSONEditorComponent
  extends QuestionAngular<JSONEditorModel>
  implements OnInit
{
  /** Control */
  public control = new FormControl<string | null>(null);
  /** Editor options */
  public editorOptions = {
    automaticLayout: true,
    theme: 'vs-dark',
    language: 'json',
    formatOnPaste: true,
    fixedOverflowWidgets: true,
  };
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * JSON editor component for Form Builder.
   * Enables to use Monaco Editor as property.
   *
   * @param changeDetectorRef Change detector ref
   * @param viewContainerRef View container ref
   */
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    viewContainerRef: ViewContainerRef
  ) {
    super(changeDetectorRef, viewContainerRef);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.control.setValue(this.model.value);
    this.control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value: any) => {
          this.model.value = value;
        },
      });
  }
}
