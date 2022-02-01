import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { AggregationBuilderService } from '../../../../services/aggregation-builder.service';
import { Observable } from 'rxjs';
import { StageType } from './pipeline-stages';

@Component({
  selector: 'safe-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss'],
})
export class SafePipelineComponent implements OnInit {
  public stageType = StageType;
  public stageList: string[] = Object.values(StageType);

  // === DATA ===
  @Input() public fields$!: Observable<any[]>;
  @Input() public metaFields$!: Observable<any[]>;
  public metaFields: any[] = [];
  public initialFields: any[] = [];

  // === PARENT FORM ===
  @Input() pipelineForm!: FormArray;
  constructor(private aggregationBuilder: AggregationBuilderService) {}

  ngOnInit(): void {
    this.fields$.subscribe((fields: any[]) => {
      this.initialFields = [...fields];
      console.log('FIELDS', fields);
    });
    this.metaFields$.subscribe((meta: any) => {
      this.metaFields = Object.assign({}, meta);
      console.log('META', meta);
    });
  }

  /**
   * Get available fields at given stage since stages will add / delete fields.
   *
   * @param index index of the stage.
   */
  public fieldsAtStage(index: number) {
    return this.aggregationBuilder.fieldsAfter(
      this.initialFields,
      this.pipelineForm.value.slice(0, index)
    );
  }

  public addStage(stage: string) {
    this.pipelineForm.push(this.aggregationBuilder.stageForm({ type: stage }));
  }

  public deleteStage(index: number) {
    this.pipelineForm.removeAt(index);
  }
}
