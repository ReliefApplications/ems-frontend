import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import {
  GET_RESOURCE,
  GetResourceByIdQueryResponse,
  GetRecordByIdQueryResponse,
  GET_RECORD_BY_ID,
  GetLayoutQueryResponse,
  GET_LAYOUT,
  GetAggregationQueryResponse,
  GET_AGGREGATION,
} from './graphql/queries';
import { Layout } from '../../../../models/layout.model';
import { Aggregation } from '../../../../models/aggregation.model';
import { Resource } from '../../../../models/resource.model';
import get from 'lodash/get';
import { SafeAggregationService } from '../../../../services/aggregation/aggregation.service';
import { SummaryCardSettingsTabTypes } from './enums/tab-types';
import { TabSettingsOptionConfig } from '../../../ui/tab-settings-options/tab-settings-options.interface';

/**
 * Card modal component.
 * Used as a Material Dialog.
 */
@Component({
  selector: 'safe-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss'],
})
export class SafeCardModalComponent implements OnInit {
  public form!: FormGroup;
  public fields: any[] = [];

  /**Config object to load the tabs in summary card settings modal */
  public tabSettingsConfig: TabSettingsOptionConfig<SummaryCardSettingsTabTypes>[] =
    [
      {
        tab: SummaryCardSettingsTabTypes.DATA_SOURCE,
        icon: 'settings',
        iconSize: 24,
        translation:
          'components.widget.settings.summaryCard.card.dataSource.title',
        tooltipPosition: 'right',
      },
      {
        tab: SummaryCardSettingsTabTypes.RECORD,
        icon: 'list',
        iconSize: 24,
        translation:
          'components.widget.settings.summaryCard.card.valueSelector.title',
        tooltipPosition: 'right',
      },
      {
        tab: SummaryCardSettingsTabTypes.SETTINGS,
        icon: 'display_settings',
        iconSize: 24,
        translation: 'common.display',
        tooltipPosition: 'right',
      },
      {
        tab: SummaryCardSettingsTabTypes.EDITOR,
        icon: 'article',
        iconSize: 24,
        translation:
          'components.widget.settings.summaryCard.card.textEditor.title',
        tooltipPosition: 'right',
      },
      {
        tab: SummaryCardSettingsTabTypes.PREVIEW,
        icon: 'preview',
        iconSize: 24,
        translation: 'common.preview',
        tooltipPosition: 'right',
      },
    ];

  /** Stores the selected tab */
  public selectedTab!: SummaryCardSettingsTabTypes;
  /** Summary card tab types to use in the components html template */
  public summaryCardSettingsTabTypes = SummaryCardSettingsTabTypes;

  // === RECORD DATA ===
  public selectedRecord: any;

  // === RESOURCE DATA ===
  public selectedResource: Resource | null = null;

  // === LAYOUT DATA ===
  public selectedLayout: Layout | null = null;

  // === AGGREGATION DATA ===
  public selectedAggregation: Aggregation | null = null;
  public customAggregation: any;

  /**
   * Card modal component.
   * Used as a Material Dialog.
   *
   * @param data card form value
   * @param dialogRef Material Dialog Ref of the component
   * @param fb Angular form builder
   * @param cdRef Change detector
   * @param apollo Apollo service
   * @param aggregationService Aggregation  service
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SafeCardModalComponent>,
    public fb: FormBuilder,
    private apollo: Apollo,
    private aggregationService: SafeAggregationService
  ) {}

  /**
   * Creates a formGroup with the data provided in the modal creation and gets the resource data used in the card.
   */
  ngOnInit(): void {
    this.form = this.fb.group({ ...this.data });

    /** === INITIALIZING FROM SAVED SETTINGS === */
    // Fetches the specified resource
    if (this.form.value.resource) {
      this.getResource(this.form.value.resource);
    }

    // Fetches the specified record data.
    if (this.form.value.record) {
      this.getRecord(this.form.value.record);
    }

    /** === SETTING UP LISTENERS FOR FORM INPUT === */
    // Clears layout/record/aggregation inputs and fetches new resource on resource change.
    this.form.controls.resource.valueChanges.subscribe((value: any) => {
      this.form.get('layout')?.setValue(null);
      this.form.get('aggregation')?.setValue(null);
      this.form.get('record')?.setValue(null);
      this.selectedLayout = null;
      this.selectedAggregation = null;
      this.selectedRecord = null;
      this.getResource(value);
    });

    // Fetches new layout on layout selection change
    this.form.controls.layout.valueChanges.subscribe((value: string) => {
      if (value) {
        this.getLayout(value);
      } else {
        this.selectedLayout = null;
      }
    });

    // Fetches new aggregation on aggregation selection change
    this.form.controls.aggregation.valueChanges.subscribe((value: string) => {
      if (value) {
        this.getAggregation(value);
      } else {
        this.selectedAggregation = null;
      }
    });

    // Fetches new record on record selection change
    this.form.controls.record.valueChanges.subscribe((value: any) => {
      if (value) {
        this.getRecord(value);
      } else {
        this.selectedRecord = null;
      }
    });
  }

  /**
   * Get record by ID, doing graphQL request
   *
   * @param id record id
   */
  private getRecord(id: string): void {
    this.apollo
      .query<GetRecordByIdQueryResponse>({
        query: GET_RECORD_BY_ID,
        variables: {
          id,
          display: true,
        },
      })
      .subscribe((res) => {
        if (res) {
          this.selectedRecord = res.data.record;
        } else {
          this.selectedRecord = null;
        }
      });
  }

  /**
   * Get resource by id, doing graphQL query
   *
   * @param id resource id
   */
  private getResource(id: string): void {
    const layoutID = this.form.value.layout;
    const aggregationID = this.form.value.aggregation;
    this.fields = [];
    this.apollo
      .query<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id,
          layout: layoutID ? [layoutID] : undefined,
          aggregation: aggregationID ? [aggregationID] : undefined,
        },
      })
      .subscribe((res) => {
        if (res.errors) {
          this.form.patchValue({
            resource: null,
            layout: null,
            aggregation: null,
            record: null,
          });
        } else {
          this.selectedResource = res.data.resource;
          if (layoutID) {
            this.selectedLayout =
              res.data?.resource.layouts?.edges[0]?.node || null;
            this.fields = [];
            get(res, 'data.resource.metadata', []).map((metafield: any) => {
              get(this.selectedLayout, 'query.fields', []).map((field: any) => {
                if (field.name === metafield.name) {
                  const type = metafield.type;
                  this.fields.push({ ...field, type });
                }
              });
            });
          }
          if (aggregationID) {
            this.selectedAggregation =
              res.data?.resource.aggregations?.edges[0]?.node || null;
            this.getCustomAggregation();
          }
        }
      });
  }

  /**
   * Gets the resource's layout by id.
   *
   * @param id layout id
   */
  private getLayout(id: string): void {
    this.apollo
      .query<GetLayoutQueryResponse>({
        query: GET_LAYOUT,
        variables: {
          id,
          resource: this.selectedResource?.id,
        },
      })
      .subscribe((res) => {
        this.selectedLayout =
          res.data?.resource.layouts?.edges[0]?.node || null;
        this.fields = [];
        get(res, 'data.resource.metadata', []).map((metafield: any) => {
          get(this.selectedLayout, 'query.fields', []).map((field: any) => {
            if (field.name === metafield.name) {
              const type = metafield.type;
              this.fields.push({ ...field, type });
            }
          });
        });
      });
  }

  /**
   * Gets the resource's aggregation by id.
   *
   * @param id aggregation id
   */
  private getAggregation(id: string): void {
    this.apollo
      .query<GetAggregationQueryResponse>({
        query: GET_AGGREGATION,
        variables: {
          id,
          resource: this.selectedResource?.id,
        },
      })
      .subscribe((res) => {
        this.selectedAggregation =
          res.data?.resource.aggregations?.edges[0]?.node || null;
        this.getCustomAggregation();
      });
  }

  /**
   * Gets the custom aggregation
   * for the selected resource and aggregation.
   */
  private getCustomAggregation(): void {
    if (!this.selectedAggregation || !this.selectedResource?.id) return;
    this.aggregationService
      .aggregationDataQuery(
        this.selectedResource.id,
        this.selectedAggregation.id || ''
      )
      ?.subscribe((res) => {
        if (res.data?.recordsAggregation) {
          this.customAggregation = res.data.recordsAggregation;
          // @TODO: Figure out fields' types from aggregation
          this.fields = this.customAggregation[0]
            ? Object.keys(this.customAggregation[0]).map((f) => ({
                name: f,
                editor: 'text',
              }))
            : [];
        }
      });
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the modal sending the form data.
   */
  onSubmit(): void {
    this.dialogRef.close(this.form.value);
  }

  /**
   * Checks if the user is in the editor tab before loading it.
   *
   * @returns Returns a boolean.
   */
  isEditorTab(): boolean {
    return this.form.get('isDynamic')?.value ||
      this.form.get('isAggregation')?.value
      ? this.selectedTab === SummaryCardSettingsTabTypes.PREVIEW
      : this.selectedTab === SummaryCardSettingsTabTypes.RECORD;
  }

  /**
   *  Handles the a tab change event
   *
   * @param event Event triggered on tab switch
   */
  handleTabChange(event: SummaryCardSettingsTabTypes): void {
    this.selectedTab = event;
  }

  /**
   * Updates modified layout
   *
   * @param layout the modified layout
   */
  handleLayoutChange(layout: Layout | null) {
    this.selectedLayout = layout;
  }

  /**
   * Updates modified aggregation
   *
   * @param aggregation the modified aggregation
   */
  handleAggregationChange(aggregation: Aggregation | null) {
    this.selectedAggregation = aggregation;
    this.getCustomAggregation();
  }
}
