import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { QueryEditorModel } from './query-editor.model';
import { QuestionAngular } from 'survey-angular-ui';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncMonacoEditorDirective } from '../../../directives/async-monaco-editor/async-monaco-editor.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Query editor component for Form Builder.
 * Enables to use Monaco Editor as property.
 * Purpose is to be able to build graphql query.
 */
@Component({
  selector: 'shared-query-editor',
  standalone: true,
  imports: [
    CommonModule,
    MonacoEditorModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncMonacoEditorDirective,
  ],
  templateUrl: './query-editor.component.html',
  styleUrls: ['./query-editor.component.scss'],
})
export class QueryEditorComponent
  extends QuestionAngular<QueryEditorModel>
  implements OnInit
{
  /** Control */
  public control = new FormControl<string | null>(null);
  /** Editor options */
  public editorOptions = {
    automaticLayout: true,
    theme: 'vs-dark',
    language: 'graphql',
    formatOnPaste: true,
    fixedOverflowWidgets: true,
  };
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Query editor component for Form Builder.
   * Enables to use Monaco Editor as property.
   * Purpose is to be able to build graphql query.
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
