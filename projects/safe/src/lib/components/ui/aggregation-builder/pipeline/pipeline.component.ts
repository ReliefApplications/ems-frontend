import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { AggregationBuilderService } from '../../../../services/aggregation-builder/aggregation-builder.service';
import { combineLatest, Observable } from 'rxjs';
import { PipelineStage } from './pipeline-stage.enum';
import { addStage } from '../aggregation-builder-forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { isEqual } from 'lodash';

/**
 * Aggregation pipeline component.
 */
@Component({
  selector: 'safe-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss'],
})
export class SafePipelineComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  public stageType = PipelineStage;
  public stageList: string[] = Object.values(PipelineStage);

  // === DATA ===
  @Input() public fields$!: Observable<any[]>;
  @Input() public metaFields$!: Observable<any[]>;
  @Input() public filterFields$!: Observable<any[]>;
  public metaFields: any[] = [];
  public filterFields: any[] = [];
  public initialFields: any[] = [];
  public fieldsPerStage: any[] = [];

  // === PARENT FORM ===
  @Input() pipelineForm!: FormArray;

  /**
   * Aggregation pipeline component.
   *
   * @param aggregationBuilder Shared aggregation builder
   */
  constructor(private aggregationBuilder: AggregationBuilderService) {
    super();
  }

  ngOnInit(): void {
    combineLatest([this.fields$, this.metaFields$, this.filterFields$])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([fields, metaFields, filterFields]) => {
          this.initialFields = [...fields];
          this.metaFields = metaFields;
          this.filterFields = filterFields;
          this.fieldsPerStage = [];
          this.updateFieldsPerStage(this.pipelineForm.value);
        },
      });
    this.pipelineForm.valueChanges
      .pipe(distinctUntilChanged(isEqual), takeUntil(this.destroy$))
      .subscribe((pipeline: any[]) => {
        this.updateFieldsPerStage(pipeline);
      });
  }

  /**
   * Updates fields for the stage.
   *
   * @param pipeline list of pipeline stages.
   */
  private updateFieldsPerStage(pipeline: any[]): void {
    for (let index = 0; index < pipeline.length; index++) {
      if (pipeline[index].type === PipelineStage.FILTER) {
        this.fieldsPerStage[index] = this.filterFields;
      } else {
        this.fieldsPerStage[index] = this.aggregationBuilder.fieldsAfter(
          this.initialFields,
          pipeline.slice(0, index)
        );
        if (pipeline[index]?.type === PipelineStage.SORT) {
          this.fieldsPerStage[index] = this.fieldsPerStage[index].filter(
            (field: any) => field.type.kind === 'SCALAR'
          );
        }
      }
    }
  }

  /**
   * Adds a stage to the aggregation pipeline.
   *
   * @param type type of stage
   */
  public addStage(type: string) {
    this.pipelineForm.push(addStage({ type }));
  }

  /**
   * Deletes a stage at specified index.
   *
   * @param index index of stage to remove in pipeline.
   */
  public deleteStage(index: number) {
    this.pipelineForm.removeAt(index);
  }

  /**
   * Moves an element in array.
   *
   * @param event positions to move.
   */
  drop(event: CdkDragDrop<string[]>) {
    const temp = this.pipelineForm.at(event.previousIndex);

    this.pipelineForm.removeAt(event.previousIndex);
    this.pipelineForm.insert(event.currentIndex, temp);
  }
}
