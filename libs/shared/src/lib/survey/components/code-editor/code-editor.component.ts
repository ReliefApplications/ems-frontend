import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionAngular } from 'survey-angular-ui';
import { CodeEditorModel } from './code-editor.model';
import { QueryParamsMappingComponent } from '../../../components/widgets/common/query-params-mapping/query-params-mapping.component';
import { FormControl } from '@angular/forms';
import { ReferenceData } from '../../../models/reference-data.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Code editor component for Form Builder.
 * Enables to use Monaco Editor as property.
 * Purpose is to be able to build graphql variables.
 */
@Component({
  selector: 'shared-code-editor',
  standalone: true,
  imports: [CommonModule, QueryParamsMappingComponent],
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent
  extends QuestionAngular<CodeEditorModel>
  implements OnInit
{
  /** Control */
  public control = new FormControl<string | null>(null);
  /** Selected reference data */
  public referenceData: ReferenceData | null = null;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Code editor component for Form Builder.
   * Enables to use Monaco Editor as property.
   * Purpose is to be able to build graphql variables.
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
    this.referenceData = this.model.obj._referenceData;
  }
}
