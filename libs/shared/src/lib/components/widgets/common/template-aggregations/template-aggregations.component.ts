import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AlertModule,
  ButtonModule,
  DividerModule,
  IconModule,
  MenuModule,
  SnackbarService,
  SpinnerModule,
  TableModule,
  TooltipModule,
} from '@oort-front/ui';
import { AggregationBuilderService } from '../../../../services/aggregation-builder/aggregation-builder.service';
import { ContextService } from '../../../../services/context/context.service';
import { EmptyModule } from '../../../ui/empty/empty.module';
import {
  createEditorForm,
  createTemplateAggregationForm,
} from '../../editor-settings/editor-settings.forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    SpinnerModule,
    AlertModule,
    EmptyModule,
  ],
  templateUrl: './template-aggregations.component.html',
  styleUrls: ['./template-aggregations.component.scss'],
})
export class TemplateAggregationsComponent implements OnInit {
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

  /** Loading state of the aggregation preview */
  public loadingAggregationRecords = false;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Template aggregations component.
   * Allow to edit and add items in the list of template aggregations.
   * Template aggregations are used by editor widget, to inject data from aggregations on resource or reference data.
   *
   * @param dialog CDK dialog service
   * @param snackBar UI Snackbar service
   * @param translateService TranslateService
   * @param contextService Shared context service
   * @param aggregationBuilder Shared Aggregation Builder Service
   */
  constructor(
    private dialog: Dialog,
    private snackBar: SnackbarService,
    private translateService: TranslateService,
    private contextService: ContextService,
    private aggregationBuilder: AggregationBuilderService
  ) {}

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
      dialogRef.closed
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
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
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value: any) => {
          if (value) {
            this.aggregations.at(index).setValue(value);
            this.data = this.aggregations.value;
          }
        });
    });
  }

  /**
   * Preview aggregation at index, opening dialog with monaco editor to display data.
   *
   * @param index aggregation index
   */
  public async onPreviewAggregation(index: number) {
    if (this.loadingAggregationRecords) {
      return;
    }
    const selectedAggregation = this.aggregations.at(index).value;
    if (!selectedAggregation.aggregation) {
      this.snackBar.openSnackBar(
        this.translateService.instant(
          'pages.aggregation.preview.missingAggregation'
        ),
        { error: true }
      );
      return;
    }
    // get the aggregation data
    this.loadingAggregationRecords = true;
    const result = await this.aggregationBuilder.onPreviewAggregation({
      referenceData: selectedAggregation.referenceData || '',
      resource: selectedAggregation.resource || '',
      aggregation: selectedAggregation.aggregation || '',
      contextFilters: JSON.parse(
        selectedAggregation.contextFilters ||
          `{
        filters: [],
        logic: 'and',
      }`
      ),
      at: selectedAggregation.at
        ? this.contextService.atArgumentValue(selectedAggregation.at)
        : undefined,
    });
    this.loadingAggregationRecords = false;
    if (Array.isArray(result) && result.length) {
      this.snackBar.openSnackBar(result[0].message, { error: true });
    }
  }
}
