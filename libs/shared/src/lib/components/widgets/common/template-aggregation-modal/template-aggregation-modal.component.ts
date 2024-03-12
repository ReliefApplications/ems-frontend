import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  DialogModule,
  DividerModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  TabsModule,
  TooltipModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContextualFiltersSettingsComponent } from '../contextual-filters-settings/contextual-filters-settings.component';
import {
  ReferenceDataSelectComponent,
  ResourceSelectComponent,
} from '../../../controls/public-api';
import { Apollo } from 'apollo-angular';
import {
  Resource,
  ResourceQueryResponse,
} from '../../../../models/resource.model';
import {
  ReferenceData,
  ReferenceDataQueryResponse,
} from '../../../../models/reference-data.model';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { Aggregation } from '../../../../models/aggregation.model';
import { GET_REFERENCE_DATA, GET_RESOURCE } from './graphql/queries';
import { AggregationService } from '../../../../services/aggregation/aggregation.service';
import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import get from 'lodash/get';
import { createTemplateAggregationForm } from '../../editor-settings/editor-settings.forms';
import { GraphqlVariablesMappingComponent } from '../graphql-variables-mapping/graphql-variables-mapping.component';

/** Dialog data interface */
interface DialogData {
  aggregation?: ReturnType<typeof createTemplateAggregationForm>;
}

/**
 * Modal to edit or add template aggregation.
 * Template aggregations are used by editor widget, to inject data from aggregations on resource or reference data.
 */
@Component({
  selector: 'shared-template-aggregation-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    TabsModule,
    ContextualFiltersSettingsComponent,
    IconModule,
    TooltipModule,
    ResourceSelectComponent,
    ReferenceDataSelectComponent,
    DividerModule,
    FormWrapperModule,
    SelectMenuModule,
    GraphqlVariablesMappingComponent,
  ],
  templateUrl: './template-aggregation-modal.component.html',
  styleUrls: ['./template-aggregation-modal.component.scss'],
})
export class TemplateAggregationModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Reactive form group */
  public form!: ReturnType<typeof createTemplateAggregationForm>;
  /** Current resource */
  public resource: Resource | null = null;
  /** Current reference data */
  public referenceData: ReferenceData | null = null;
  /** Current aggregation */
  public aggregation?: Aggregation;

  /**
   * Modal to edit or add template aggregation.
   * Template aggregations are used by editor widget, to inject data from aggregations on resource or reference data.
   *
   * @param apollo Apollo service
   * @param aggregationService Shared aggregation service
   * @param dialog CDK dialog service
   * @param data Data passed to dialog
   */
  constructor(
    private apollo: Apollo,
    private aggregationService: AggregationService,
    private dialog: Dialog,
    @Inject(DIALOG_DATA) public data?: DialogData
  ) {
    super();
    this.form = createTemplateAggregationForm(data?.aggregation?.value);
  }

  ngOnInit(): void {
    this.form
      .get('resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        // As the ui doesn't allow resource to be set to null while resource appears, we can always remove the aggregation
        this.form.get('aggregation')?.setValue(null);
        if (value) {
          this.getResource(value);
        } else {
          this.resource = null;
        }
      });
    if (this.form.value.resource) {
      this.getResource(this.form.value.resource);
    }
    this.form
      .get('referenceData')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        // As the ui doesn't allow ref data to be set to null while resource appears, we can always remove the aggregation
        this.form.get('aggregation')?.setValue(null);
        if (value) {
          this.getReferenceData(value);
        } else {
          this.referenceData = null;
        }
      });
    if (this.form.value.referenceData) {
      this.getReferenceData(this.form.value.referenceData);
    }
  }

  /**
   * Reset given form field value if there is a value previously to avoid triggering
   * not necessary actions
   *
   * @param formField Current form field
   * @param event click event
   */
  clearFormField(formField: string, event: Event) {
    if (this.form.get(formField)?.value) {
      this.form.get(formField)?.setValue(null);
    }
    event.stopPropagation();
  }

  /**
   * Get a resource by id and associated aggregations
   *
   * @param id resource id
   */
  private getResource(id: string): void {
    const aggregationId = this.form.value.aggregation;
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id,
          aggregationIds: aggregationId ? [aggregationId] : null,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          this.resource = data.resource;
          if (aggregationId && this.resource.aggregations?.edges[0]) {
            this.aggregation = this.resource.aggregations.edges[0].node;
            this.form.controls.name.setValue(this.aggregation.name as string);
          }
        },
      });
  }

  /**
   * Get reference data by id
   *
   * @param id reference data id
   */
  private getReferenceData(id: string): void {
    const aggregationId = this.form.value.aggregation;
    this.apollo
      .query<ReferenceDataQueryResponse>({
        query: GET_REFERENCE_DATA,
        variables: {
          id,
          aggregationIds: aggregationId ? [aggregationId] : null,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          this.referenceData = data.referenceData;
          if (aggregationId && this.referenceData.aggregations?.edges[0]) {
            this.aggregation = this.referenceData.aggregations.edges[0].node;
            this.form.controls.name.setValue(this.aggregation.name as string);
          }
        },
      });
  }

  /**
   * Adds a new aggregation to the list.
   */
  public async addAggregation(): Promise<void> {
    const { AddAggregationModalComponent } = await import(
      '../../../aggregation/add-aggregation-modal/add-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        hasAggregations:
          get(
            this.resource ? this.resource : this.referenceData,
            'aggregations.totalCount',
            0
          ) > 0, // check if at least one existing aggregation
        resource: this.resource,
        referenceData: this.referenceData,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.form.get('aggregation')?.setValue(value.id);
        this.aggregation = value;
        this.form.controls.name.setValue(this.aggregation?.name as string);
      }
    });
  }

  /**
   * Edit chosen aggregation, in a modal. If saved, update it.
   */
  public async editAggregation(): Promise<void> {
    const { EditAggregationModalComponent } = await import(
      '../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(EditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.resource,
        referenceData: this.referenceData,
        aggregation: this.aggregation,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value && this.aggregation) {
        this.aggregationService
          .editAggregation(this.aggregation, value, {
            resource: this.resource?.id,
            referenceData: this.referenceData?.id,
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: ({ data }) => {
              if (data?.editAggregation) {
                if (this.resource) {
                  this.getResource(this.resource?.id as string);
                } else {
                  this.getReferenceData(this.referenceData?.id as string);
                }
              }
            },
          });
      }
    });
  }
}
