import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { QueryEditorModel } from './query-editor.model';
import { QuestionAngular } from 'survey-angular-ui';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

/**
 * Query editor component for Form Builder.
 * Enables to use Monaco Editor as property.
 * Purpose is to be able to build graphql query.
 */
@Component({
  selector: 'shared-query-editor',
  standalone: true,
  imports: [CommonModule, MonacoEditorModule, FormsModule, ReactiveFormsModule],
  templateUrl: './query-editor.component.html',
  styleUrls: ['./query-editor.component.scss'],
})
export class QueryEditorComponent
  extends QuestionAngular<QueryEditorModel>
  implements OnInit, OnDestroy
{
  /** Control */
  public control = new FormControl<string | null>(null);
  /** Destroy subject */
  private destroy$: Subject<void> = new Subject<void>();
  /** Editor options */
  public editorOptions = {
    automaticLayout: true,
    theme: 'vs-dark',
    language: 'graphql',
    formatOnPaste: true,
    fixedOverflowWidgets: true,
  };

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
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value: any) => {
        this.model.value = value;
      },
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
