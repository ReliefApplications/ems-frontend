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
  AlertModule,
} from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import {
  createEditorForm,
  createTemplateAggregationForm,
} from '../../editor-settings/editor-settings.forms';
import { EmptyModule } from '../../../ui/empty/empty.module';

/**
 * Template aggregations component.
 * Allow to edit and add items in the list of template aggregations.
 * Template aggregations are used by editor widget, to inject data from aggregations on resource or reference data.
 */
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
    AlertModule,
    EmptyModule,
  ],
  templateUrl: './template-aggregations.component.html',
  styleUrls: ['./template-aggregations.component.scss'],
})
export class TemplateAggregationsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Template aggregation form group */
  @Input() formGroup!: ReturnType<typeof createEditorForm>;
  /** Bind to form group data */
  public data: any[] = [];
  /** Columns to display */
  public displayedColumns = ['name', 'id', 'actions'];

  /** @returns aggregations from form group as form array */
  get aggregations() {
    return this.formGroup.controls.aggregations;
  }

  /**
   * Template aggregations component.
   * Allow to edit and add items in the list of template aggregations.
   * Template aggregations are used by editor widget, to inject data from aggregations on resource or reference data.
   *
   * @param dialog CDK dialog service
   */
  constructor(private dialog: Dialog) {
    super();
  }

  ngOnInit() {
    this.data = this.aggregations.value;
  }

  /**
   * Open dialog to add a new aggregation.
   */
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

  /**
   * Remove aggregation at index
   *
   * @param index aggregation index
   */
  public onRemoveAggregation(index: number) {
    this.aggregations.removeAt(index);
    this.data = this.aggregations.value;
  }

  /**
   * Edit aggregation at index, opening template aggregation modal.
   *
   * @param index aggregation index
   */
  public onEditAggregation(index: number) {
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
