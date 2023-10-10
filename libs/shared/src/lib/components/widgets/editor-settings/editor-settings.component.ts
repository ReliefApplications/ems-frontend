import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WIDGET_EDITOR_CONFIG } from '../../../const/tinymce.const';
import { EditorService } from '../../../services/editor/editor.service';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import {
  Resource,
  ResourceQueryResponse,
} from '../../../models/resource.model';
import { Layout } from '../../../models/layout.model';
import { Apollo } from 'apollo-angular';
import { GET_REFERENCE_DATA, GET_RESOURCE } from './graphql/queries';
import { get } from 'lodash';
import { DataTemplateService } from '../../../services/data-template/data-template.service';
import {
  ReferenceData,
  ReferenceDataQueryResponse,
} from '../../../models/reference-data.model';
import { Aggregation } from '../../../models/aggregation.model';
import { lastValueFrom, takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { AggregationService } from '../../../services/aggregation/aggregation.service';

/**
 * Creates the form for the editor widget settings.
 *
 * @param value editor widget
 * @returns the editor widget form group
 */
const createEditorForm = (value: any) => {
  const form = new FormGroup({
    id: new FormControl<string>(value.id),
    title: new FormControl<string>(get(value, 'settings.title', '')),
    text: new FormControl<string>(get(value, 'settings.text', '')),
    // for record selection
    resource: new FormControl<string>(get(value, 'settings.resource', null)),
    referenceData: new FormControl<string>(
      get(value, 'settings.referenceData', null)
    ),
    aggregation: new FormControl<string>(
      get(value, 'settings.aggregation', null)
    ),
    aggregationItem: new FormControl<string>(
      get(value, 'settings.aggregationItem', null)
    ),
    aggregationItemIdentifier: new FormControl<string>(
      get(value, 'settings.aggregationItemIdentifier', null)
    ),
    layout: new FormControl<string>(get(value, 'settings.layout', null)),
    record: new FormControl<string>(get(value, 'settings.record', null)),
    showDataSourceLink: new FormControl<boolean>(
      get(value, 'showDataSourceLink', false)
    ),
    // Style
    useStyles: new FormControl<boolean>(get(value, 'settings.useStyles', true)),
    wholeCardStyles: new FormControl<boolean>(
      get(value, 'settings.wholeCardStyles', false)
    ),
  });

  return extendWidgetForm(form, value?.settings?.widgetDisplay);
};

export type EditorFormType = ReturnType<typeof createEditorForm>;

/**
 * Modal content for the settings of the editor widgets.
 */
@Component({
  selector: 'shared-editor-settings',
  templateUrl: './editor-settings.component.html',
  styleUrls: ['./editor-settings.component.scss'],
})
export class EditorSettingsComponent
  extends UnsubscribeComponent
  implements OnInit, AfterViewInit
{
  // === REACTIVE FORM ===
  tileForm!: EditorFormType;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  /** tinymce editor */
  public editor: any = WIDGET_EDITOR_CONFIG;

  public selectedResource: Resource | null = null;
  /** Current reference data */
  public selectedReferenceData: ReferenceData | null = null;
  /** Current layout */
  public selectedLayout: Layout | null = null;
  /** Current aggregation */
  public selectedAggregation: Aggregation | null = null;
  public customAggregation: any;

  /**
   * Modal content for the settings of the editor widgets.
   *
   * @param editorService Editor service used to get main URL and current language
   * @param apollo Apollo service
   * @param dataTemplateService Shared data template service
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private editorService: EditorService,
    private apollo: Apollo,
    private dataTemplateService: DataTemplateService,
    private aggregationService: AggregationService
  ) {
    super();
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
    this.dataTemplateService.setEditorLinkList(this.editor);
  }

  /**
   * Build the settings form, using the widget saved parameters.
   */
  ngOnInit(): void {
    this.tileForm = createEditorForm(this.tile);
    this.change.emit(this.tileForm);

    this.tileForm
      .get('resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.getResource(value);
          this.tileForm.get('referenceData')?.setValue(null);
        } else {
          this.selectedResource = null;
        }
        this.tileForm.get('aggregation')?.setValue(null);
        this.tileForm.get('layout')?.setValue(null);
      });
    // Initialize the selected resource, layout and record from the form
    const resourceID = this.tileForm?.get('resource')?.value;
    if (resourceID) {
      this.getResource(resourceID);
    }
    this.tileForm
      .get('referenceData')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.getReferenceData(value);
          this.tileForm.get('resource')?.setValue(null);
        } else {
          this.selectedReferenceData = null;
        }
        this.tileForm.get('aggregation')?.setValue(null);
        this.tileForm.get('layout')?.setValue(null);
      });
    // Initialize the selected reference data from the form
    const referenceDataID = this.tileForm?.get('referenceData')?.value;
    if (referenceDataID) {
      this.getReferenceData(referenceDataID);
    }
    this.tileForm
      .get('aggregation')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (!data) {
          this.selectedAggregation = null;
          this.customAggregation = null;
        }
      });
    this.tileForm
      .get('layout')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (!value) {
          this.selectedLayout = null;
        }
      });
  }

  /**
   * Get resource with aggregations and layouts for the given id
   *
   * @param resourceID resource id
   */
  private getResource(resourceID: string) {
    const layoutID = this.tileForm.get('layout')?.value;
    const aggregationID = this.tileForm.get('aggregation')?.value;
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id: resourceID,
          layout: layoutID ? [layoutID] : undefined,
          aggregation: aggregationID ? [aggregationID] : undefined,
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.selectedResource = res.data.resource;
          if (layoutID) {
            this.selectedLayout =
              res.data?.resource.layouts?.edges[0]?.node || null;
          }
          if (aggregationID) {
            this.selectedAggregation =
              res.data?.resource.aggregations?.edges[0]?.node || null;
          }
          this.updateFields();
        }
      });
  }

  /**
   * Get reference data with aggregations for the given id
   *
   * @param referenceDataID reference data id
   */
  private getReferenceData(referenceDataID: string): void {
    const aggregationID = this.tileForm.get('aggregation')?.value;
    this.apollo
      .query<ReferenceDataQueryResponse>({
        query: GET_REFERENCE_DATA,
        variables: {
          id: referenceDataID,
          aggregation: aggregationID ? [aggregationID] : undefined,
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.selectedReferenceData = res.data.referenceData;
          if (aggregationID) {
            this.selectedAggregation =
              res.data?.referenceData.aggregations?.edges[0]?.node || null;
            this.updateFields();
          }
        }
      });
  }

  /**
   * Detect the form changes to emit the new configuration.
   */
  ngAfterViewInit(): void {
    this.tileForm?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.change.emit(this.tileForm);
      this.tile.settings.text = this.tileForm.value.text;
      this.tile.settings.record = this.tileForm.value.record;
      this.tile.settings.title = this.tileForm.value.title;
      this.tile.settings.resource = this.tileForm.value.resource;
      this.tile.settings.referenceData = this.tileForm.value.referenceData;
      this.tile.settings.layout = this.tileForm.value.layout;
      this.tile.settings.aggregation = this.tileForm.value.aggregation;
      this.tile.settings.aggregationItem = this.tileForm.value.aggregationItem;
      this.tile.settings.aggregationItemIdentifier =
        this.tileForm.value.aggregationItemIdentifier;
    });
  }

  /** Extracts the fields from the resource/layout */
  public async updateFields() {
    // extract data keys from metadata
    let fields: any = [];
    if (this.selectedResource) {
      if (this.selectedLayout) {
        get(this.selectedResource, 'metadata', []).forEach((metaField: any) => {
          get(this.selectedLayout, 'query.fields', []).forEach((field: any) => {
            if (field.name === metaField.name) {
              const type = metaField.type;
              fields.push({ ...field, type });
            }
          });
        });
      } else if (this.selectedAggregation) {
        fields = get(this.selectedResource, 'metadata', []).filter((metadata) =>
          (this.selectedAggregation?.sourceFields ?? []).includes(metadata.name)
        );
      }
    } else if (this.selectedReferenceData) {
      fields = await this.getCustomAggregation();
    }
    // Setup editor auto complete
    this.editorService.addCalcAndKeysAutoCompleter(this.editor, [
      ...this.dataTemplateService.getAutoCompleterKeys(fields),
      ...this.dataTemplateService.getAutoCompleterPageKeys(),
    ]);
  }

  /**
   * Gets the custom aggregation
   * for the selected (resource or reference data) and aggregation.
   */
  private async getCustomAggregation(): Promise<any[]> {
    if (
      !this.selectedAggregation ||
      (!this.selectedResource?.id && !this.selectedReferenceData?.id)
    ) {
      return [];
    }
    const id =
      this.selectedResource?.id ?? this.selectedReferenceData?.id ?? '';
    const type = this.selectedResource?.id ? 'resource' : 'referenceData';
    const res = await lastValueFrom(
      this.aggregationService.aggregationDataQuery(
        id,
        type,
        this.selectedAggregation.id || ''
      )
    );
    const aggregations =
      res.data?.recordsAggregation ?? res.data?.referenceDataAggregation;
    let fields: any[] = [];
    if (aggregations) {
      this.customAggregation = aggregations;
      // @TODO: Figure out fields' types from aggregation
      fields = this.customAggregation.items[0]
        ? Object.keys(this.customAggregation.items[0]).map((f) => ({
            name: f,
            editor: 'text',
          }))
        : [];
    }
    return fields;
  }

  /**
   * Updates modified layout
   *
   * @param layout the modified layout
   */
  handleLayoutChange(layout: Layout | null) {
    this.selectedLayout = layout;
    this.updateFields();
  }

  /**
   * Updates modified aggregation
   *
   * @param aggregation the modified aggregation
   */
  handleAggregationChange(aggregation: Aggregation | null) {
    this.selectedAggregation = aggregation;
    this.updateFields();
  }
}
