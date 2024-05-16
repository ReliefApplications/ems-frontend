import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionAngular } from 'survey-angular-ui';
import { JSONEditorModel } from './json-editor.model';
import { Subject, takeUntil } from 'rxjs';
import { MonacoEditorComponent } from '../../../components/widgets/common/monaco-editor/monaco-editor.component';

/**
 * JSON editor component for Form Builder.
 * Enables to use Monaco Editor as property.
 */
@Component({
  selector: 'shared-json-editor',
  standalone: true,
  imports: [
    CommonModule,
    MonacoEditorComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss'],
})
export class JSONEditorComponent
  extends QuestionAngular<JSONEditorModel>
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
    language: 'json',
    formatOnPaste: true,
    fixedOverflowWidgets: true,
  };

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
