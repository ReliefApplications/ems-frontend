import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ButtonModule,
  DividerModule,
  IconModule,
  MenuModule,
  SnackbarService,
  SpinnerModule,
  TableModule,
  TooltipModule,
  AlertModule,
} from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { firstValueFrom, takeUntil } from 'rxjs';
import {
  createEditorForm,
  createTemplateAggregationForm,
} from '../../editor-settings/editor-settings.forms';
import { AggregationService } from '../../../../services/aggregation/aggregation.service';
import { ContextService } from '../../../../services/context/context.service';
import { EmptyModule } from '../../../ui/empty/empty.module';
import {
  AggregationDataQueryResponse,
  ReferenceDataAggregationQueryResponse,
} from '../../../../models/aggregation.model';

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

  /** Loading state of the aggregation preview */
  public loadingAggregationRecords = false;

  /**
   * Template aggregations component.
   * Allow to edit and add items in the list of template aggregations.
   * Template aggregations are used by editor widget, to inject data from aggregations on resource or reference data.
   *
   * @param dialog CDK dialog service
   * @param snackBar UI Snackbar service
   * @param translateService TranslateService
   * @param contextService Shared context service
   * @param aggregationService Shared Aggregation Service
   */
  constructor(
    private dialog: Dialog,
    private snackBar: SnackbarService,
    private translateService: TranslateService,
    private contextService: ContextService,
    private aggregationService: AggregationService
  ) {
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
    const query$ = this.aggregationService.aggregationDataQuery({
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
      first: -1,
    });

    const { data: aggregationData, errors } = await firstValueFrom(query$);
    if (!aggregationData || errors) {
      this.loadingAggregationRecords = false;
      if (errors?.length) {
        this.snackBar.openSnackBar(errors[0].message, { error: true });
      }
      return;
    }
    this.loadingAggregationRecords = false;
    this.openAggregationPayload(aggregationData);
  }

  /**
   * Opens a dialog displaying the aggregation data given
   *
   * @param aggregationData Aggregation data to display in the preview dialog
   */
  public async openAggregationPayload(
    aggregationData:
      | AggregationDataQueryResponse
      | ReferenceDataAggregationQueryResponse
  ) {
    const { PayloadModalComponent } = await import(
      '../../../payload-modal/payload-modal.component'
    );
    this.dialog.open(PayloadModalComponent, {
      data: {
        payload:
          'recordsAggregation' in aggregationData
            ? aggregationData.recordsAggregation
            : aggregationData.referenceDataAggregation,
        aggregationPayload: true,
      },
    });
  }
}
