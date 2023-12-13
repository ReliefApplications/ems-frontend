import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DividerModule,
  IconModule,
  MenuModule,
  TableModule,
  TooltipModule,
} from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import {
  createEditorForm,
  createTemplateAggregationForm,
} from '../../editor-settings/editor-settings.forms';

@Component({
  selector: 'shared-template-aggregations',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TableModule,
    ButtonModule,
    MenuModule,
    IconModule,
    TooltipModule,
    DividerModule,
  ],
  templateUrl: './template-aggregations.component.html',
  styleUrls: ['./template-aggregations.component.scss'],
})
export class TemplateAggregationsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  @Input() formGroup!: ReturnType<typeof createEditorForm>;
  /** Bind to form group data */
  public data: any[] = [];
  /** Columns to display */
  public displayedColumns = ['name', 'id', 'actions'];

  get aggregations() {
    return this.formGroup.controls.aggregations;
  }

  constructor(private dialog: Dialog) {
    super();
  }

  ngOnInit() {
    this.data = this.aggregations.value;
  }

  public onAddAggregation() {
    import(
      '../template-aggregation-modal/template-aggregation-modal.component'
    ).then(({ TemplateAggregationModalComponent }) => {
      const dialogRef = this.dialog.open(TemplateAggregationModalComponent, {
        autoFocus: false,
      });
      dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        if (value) {
          this.aggregations.push(createTemplateAggregationForm(value));
          this.data = this.aggregations.value;
        }
      });
    });
  }

  public onRemoveAggregation(index: number) {
    console.log(index);
    this.aggregations.removeAt(index);
    this.data = this.aggregations.value;
  }

  public onEditAggregation(index: number) {
    console.log(index);
    import(
      '../template-aggregation-modal/template-aggregation-modal.component'
    ).then(({ TemplateAggregationModalComponent }) => {
      const dialogRef = this.dialog.open(TemplateAggregationModalComponent, {
        data: {
          aggregation: this.aggregations.at(index),
        },
        autoFocus: false,
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            this.aggregations.at(index).setValue(value);
            this.data = this.aggregations.value;
          }
        });
    });
  }
}
