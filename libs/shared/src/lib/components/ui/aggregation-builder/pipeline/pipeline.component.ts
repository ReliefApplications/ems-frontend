import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { AggregationBuilderService } from '../../../../services/aggregation-builder/aggregation-builder.service';
import { Observable } from 'rxjs';
import { PipelineStage } from './pipeline-stage.enum';
import { addStage } from '../aggregation-builder-forms';
import { debounceTime } from 'rxjs/operators';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/**
 * Aggregation pipeline component.
 */
@Component({
  selector: 'shared-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss'],
})
export class PipelineComponent extends UnsubscribeComponent implements OnInit {
  public stageType = PipelineStage;
  public stageList: string[] = Object.values(PipelineStage);

  // === DATA ===
  @Input() public fields$!: Observable<any[]>;
  @Input() public metaFields$!: Observable<any[]>;
  public metaFields: any[] = [];
  public initialFields: any[] = [];
  public fieldsPerStage: any[] = [];

  // === PARENT FORM ===
  @Input() pipelineForm!: UntypedFormArray;

  /**
   * Aggregation pipeline component.
   *
   * @param aggregationBuilder Shared aggregation builder
   */
  constructor(private aggregationBuilder: AggregationBuilderService) {
    super();
  }

  ngOnInit(): void {
    this.fields$.subscribe((fields: any[]) => {
      this.initialFields = [...fields];
      this.fieldsPerStage = [];
      this.updateFieldsPerStage(this.pipelineForm.value);
    });
    this.metaFields$.subscribe((meta: any) => {
      this.metaFields = Object.assign({}, meta);
    });
    this.pipelineForm.valueChanges
      .pipe(debounceTime(500))
      .pipe(takeUntil(this.destroy$))
      .subscribe((pipeline: any[]) => this.updateFieldsPerStage(pipeline));
  }

  /**
   * Updates fields for the stage.
   *
   * @param pipeline list of pipeline stages.
   */
  private updateFieldsPerStage(pipeline: any[]): void {
    for (let index = 0; index < pipeline.length; index++) {
      this.fieldsPerStage[index] = this.aggregationBuilder.fieldsAfter(
        this.initialFields,
        pipeline.slice(0, index)
      );
      if (
        pipeline[index]?.type === PipelineStage.FILTER ||
        pipeline[index]?.type === PipelineStage.SORT
      ) {
        this.fieldsPerStage[index] = this.fieldsPerStage[index].filter(
          (field: any) => field.type.kind === 'SCALAR'
        );
      }
      this.fieldsPerStage[index] = this.fieldsPerStage[index].filter(
        (field: any) => field.name
      );
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
