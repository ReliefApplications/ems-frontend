import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionAngular } from 'survey-angular-ui';
import { CodeEditorModel } from './code-editor.model';
import { GraphqlVariablesMappingComponent } from '../../../components/widgets/common/graphql-variables-mapping/graphql-variables-mapping.component';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ReferenceData } from '../../../models/reference-data.model';
import { ReferenceDataService } from '../../../services/reference-data/reference-data.service';

@Component({
  selector: 'shared-code-editor',
  standalone: true,
  imports: [CommonModule, GraphqlVariablesMappingComponent],
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent
  extends QuestionAngular<CodeEditorModel>
  implements OnInit, OnDestroy
{
  /** Control */
  public control = new FormControl<string | null>(null);
  /** Destroy subject */
  private destroy$: Subject<void> = new Subject<void>();
  /** Selected reference data */
  public referenceData: ReferenceData | null = null;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    viewContainerRef: ViewContainerRef,
    private referenceDataService: ReferenceDataService
  ) {
    super(changeDetectorRef, viewContainerRef);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.control.setValue(this.model.value);
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value: any) => {
        console.log('change change');
        this.model.value = value;
      },
    });
    this.referenceDataService
      .loadReferenceData(this.model.obj.referenceData)
      .then((referenceData) => {
        this.referenceData = referenceData;
        this.changeDetectorRef.detectChanges();
      });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
