import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { AggregationBuilderService } from '../../../../services/aggregation-builder/aggregation-builder.service';
import { Observable } from 'rxjs';
import { PipelineStage } from './pipeline-stage.enum';
import { addStage } from '../aggregation-builder-forms';
import { debounceTime } from 'rxjs/operators';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

/**
 * Aggregation pipeline component.
 */
@Component({
  selector: 'shared-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss'],
})
export class PipelineComponent extends UnsubscribeComponent implements OnInit {
  /** Public variable for stage type. */
  public stageType = PipelineStage;
  /** Array to hold the list of stages. */
  public stageList: string[] = Object.values(PipelineStage);

  /** Input decorator for fields$. */
  @Input() public fields$!: Observable<any[]>;
  /** Input decorator for metaFields$. */
  @Input() public metaFields$!: Observable<any[]>;
  /** Array to hold the meta fields. */
  public metaFields: any[] = [];
  /** Array to hold the initial fields. */
  public initialFields: any[] = [];
  /** Array to hold the fields per stage. */
  public fieldsPerStage: any[] = [];

  /** Input decorator for pipelineForm. */
  @Input() pipelineForm!: UntypedFormArray;

  public previewPipelineForm: UntypedFormArray = new UntypedFormArray([]);

  public checked = true;

  @Output() previewPipelineFormChange = new EventEmitter<any>();

  /**
   * Aggregation pipeline component.
   *
   * @param aggregationBuilder Shared aggregation builder
   */
  constructor(private aggregationBuilder: AggregationBuilderService) {
    super();
  }

  /** OnInit lifecycle hook. */
  ngOnInit(): void {
    this.previewPipelineForm = _.cloneDeep(this.pipelineForm);
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
      .subscribe((pipeline: any[]) => {
        this.updateFieldsPerStage(pipeline);
      });
  }

  onCheckboxChange(index: number) {
    if (this.previewPipelineForm.at(index).enabled == false) {
      this.previewPipelineForm.at(index).enable();
    } else {
      this.previewPipelineForm.at(index).disable();
    }
    this.previewPipelineFormChange.emit(this.previewPipelineForm.value);
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
    this.previewPipelineForm.push(addStage({ type }));
    this.previewPipelineFormChange.emit(this.previewPipelineForm.value);
  }

  /**
   * Deletes a stage at specified index.
   *
   * @param index index of stage to remove in pipeline.
   */
  public deleteStage(index: number) {
    this.pipelineForm.removeAt(index);
    this.previewPipelineForm.removeAt(index);
    this.previewPipelineFormChange.emit(this.previewPipelineForm.value);
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

    const tempPreview = this.previewPipelineForm.at(event.previousIndex);
    this.previewPipelineForm.removeAt(event.previousIndex);
    this.previewPipelineForm.insert(event.currentIndex, tempPreview);

    this.previewPipelineFormChange.emit(this.previewPipelineForm.value);
  }
}
