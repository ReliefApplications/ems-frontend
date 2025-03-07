import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { WIDGET_EDITOR_CONFIG } from '../../../const/tinymce.const';
import { EditorService } from '../../../services/editor/editor.service';
import {
  Resource,
  ResourceQueryResponse,
} from '../../../models/resource.model';
import { Layout } from '../../../models/layout.model';
import { Apollo } from 'apollo-angular';
import { GET_REFERENCE_DATA, GET_RESOURCE } from './graphql/queries';
import { get } from 'lodash';
import { DataTemplateService } from '../../../services/data-template/data-template.service';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import {
  ReferenceData,
  ReferenceDataQueryResponse,
} from '../../../models/reference-data.model';
import { createEditorForm } from './editor-settings.forms';
import { WidgetSettings } from '../../../models/dashboard.model';
import { WidgetService } from '../../../services/widget/widget.service';
import { RawEditorSettings } from 'tinymce';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormWrapperModule,
  SelectMenuModule,
  SelectOptionModule,
  ButtonModule,
  TabsModule,
  TooltipModule,
  IconModule,
  CheckboxModule,
  RadioModule,
  DividerModule,
  ToggleModule,
  SpinnerModule,
} from '@oort-front/ui';
import {
  ResourceSelectComponent,
  ReferenceDataSelectComponent,
} from '../../controls/public-api';
import { CoreGridModule } from '../../ui/core-grid/core-grid.module';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { TabWidgetAutomationsComponent } from '../common/tab-widget-automations/tab-widget-automations.component';
import { TemplateAggregationsComponent } from '../common/template-aggregations/template-aggregations.component';
import {
  EditorModule as TinyMceEditorModule,
  TINYMCE_SCRIPT_SRC,
} from '@tinymce/tinymce-angular';
import { RecordSelectionTabComponent } from './record-selection-tab/record-selection-tab.component';
import { EditorModule } from '../editor/editor.module';

/**
 * Modal content for the settings of the editor widgets.
 */
@Component({
  selector: 'shared-editor-settings',
  templateUrl: './editor-settings.component.html',
  styleUrls: ['./editor-settings.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    TinyMceEditorModule,
    TranslateModule,
    DisplaySettingsComponent,
    CoreGridModule,
    EditorModule,
    SelectMenuModule,
    SelectOptionModule,
    ButtonModule,
    TabsModule,
    TooltipModule,
    IconModule,
    CheckboxModule,
    RadioModule,
    DividerModule,
    ToggleModule,
    ResourceSelectComponent,
    ReferenceDataSelectComponent,
    SpinnerModule,
    TemplateAggregationsComponent,
    // todo: rename ( remove s )
    TabWidgetAutomationsComponent,
    RecordSelectionTabComponent,
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class EditorSettingsComponent
  extends UnsubscribeComponent
  implements
    OnInit,
    AfterViewInit,
    OnDestroy,
    WidgetSettings<typeof createEditorForm>
{
  /** Widget configuration */
  @Input() widget: any;
  /** Widget form group */
  widgetFormGroup!: ReturnType<typeof createEditorForm>;
  /** Change event emitter */
  @Output() formChange: EventEmitter<ReturnType<typeof createEditorForm>> =
    new EventEmitter();
  /** tinymce editor configuration */
  public editor: RawEditorSettings = WIDGET_EDITOR_CONFIG;
  /** Current resource */
  public resource: Resource | null = null;
  /** Current reference data */
  public referenceData: ReferenceData | null = null;
  /** Current layout */
  public layout: Layout | null = null;
  /** Loading indicator */
  public loading = true;
  /** Is editor loading */
  public editorLoading = true;
  /** Html element containing widget custom style */
  private customStyle?: HTMLStyleElement;

  /**
   * Modal content for the settings of the editor widgets.
   *
   * @param editorService Editor service used to get main URL and current language
   * @param apollo Apollo service
   * @param dataTemplateService Shared data template service
   * @param widgetService Shared widget service
   */
  constructor(
    private editorService: EditorService,
    private apollo: Apollo,
    private dataTemplateService: DataTemplateService,
    private widgetService: WidgetService
  ) {
    super();
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
    this.dataTemplateService.setEditorLinkList(this.editor);
  }

  ngOnInit(): void {
    // Initialize style
    this.widgetService
      .createCustomStyle('widgetPreview', this.widget)
      .then((customStyle) => {
        if (customStyle) {
          this.customStyle = customStyle;
        }
      });
    // Build settings
    if (!this.widgetFormGroup) {
      this.buildSettingsForm();
    }

    // Initialize the selected resource, layout and record from the form
    const resourceID = this.widgetFormGroup?.get('resource')?.value;
    const layoutID = this.widgetFormGroup?.get('layout')?.value;
    const referenceDataID = this.widgetFormGroup?.get('referenceData')?.value;

    // If set, fetch resource & layout
    if (resourceID) {
      this.getResource(resourceID, layoutID);
    }
    // Subscribe to resource changes
    this.widgetFormGroup.controls.resource.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((resource) => {
        this.widget.settings.resource = resource;
        if (resource) {
          this.widgetFormGroup.controls.referenceData.setValue(null);
          this.widgetFormGroup.controls.showDataSourceLink.enable();
          this.getResource(resource);
        } else {
          this.resource = null;
          this.layout = null;
        }
      });
    // Subscribe to layout changes
    this.widgetFormGroup.controls.layout.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((layout) => {
        this.widget.settings.layout = layout;
        if (layout && this.resource) {
          this.getResource(this.resource.id as string, layout);
        } else {
          this.layout = null;
        }
      });

    // If set, fetch reference data
    if (referenceDataID) {
      this.getReferenceData(referenceDataID);
    }
    // Subscribe to reference data changes
    this.widgetFormGroup.controls.referenceData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((referenceData) => {
        this.widget.settings.referenceData = referenceData;
        if (referenceData) {
          this.widgetFormGroup.controls.resource.setValue(null);
          this.widgetFormGroup.controls.showDataSourceLink.disable();
          this.getReferenceData(referenceData);
        } else {
          this.referenceData = null;
        }
      });
    if (!resourceID && !referenceDataID) {
      this.updateFields();
      this.loading = false;
    }

    // Refresh when aggregations field changes
    this.widgetFormGroup.controls.aggregations.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((aggregations) => {
        this.widget.settings.aggregations = aggregations;
        this.updateFields();
      });
  }

  override ngOnDestroy(): void {
    // Remove the custom style when the component is destroyed
    if (this.customStyle) {
      this.customStyle.remove();
    }
  }

  /**
   * Detect the form changes to emit the new configuration.
   */
  ngAfterViewInit(): void {
    this.widgetFormGroup?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.widgetFormGroup.markAsDirty({ onlySelf: true });
        this.formChange.emit(this.widgetFormGroup);
        // todo: check if relevant
        this.widget.settings.text = this.widgetFormGroup.value.text;
        this.widget.settings.record = this.widgetFormGroup.value.record;
        this.widget.settings.title = this.widgetFormGroup.value.title;
        this.widget.settings.showDataSourceLink =
          this.widgetFormGroup.value.showDataSourceLink;
      });
  }

  /**
   * Get resource for widget configuration
   *
   * @param resource selected resource id
   * @param layout selected layout id ( optional )
   */
  private getResource(resource: string, layout?: string | null) {
    this.loading = true;
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id: resource,
          layout: layout ? [layout] : undefined,
        },
      })
      .subscribe(({ data }) => {
        if (data) {
          this.resource = data.resource;
          if (layout) {
            this.layout = data.resource.layouts?.edges[0]?.node || null;
          } else {
            this.layout = null;
          }
          this.updateFields();
        }
        this.loading = false;
      });
  }

  /**
   * Get reference data by id
   *
   * @param referenceData reference data id
   */
  private getReferenceData(referenceData: string) {
    this.loading = true;
    this.apollo
      .query<ReferenceDataQueryResponse>({
        query: GET_REFERENCE_DATA,
        variables: {
          id: referenceData,
        },
      })
      .subscribe(({ data }) => {
        if (data) {
          this.referenceData = data.referenceData;
          this.updateFields();
        }
        this.loading = false;
      });
  }

  /** Extracts the fields from the resource/layout */
  public updateFields() {
    // extract data keys from metadata
    let fields: any = [];
    if (this.resource) {
      get(this.resource, 'metadata', []).forEach((metaField: any) => {
        get(this.layout, 'query.fields', []).forEach((field: any) => {
          if (field.name === metaField.name) {
            const type = metaField.type;
            fields.push({ ...field, type });
          }
        });
      });
    } else if (this.referenceData) {
      fields = (this.referenceData.fields || [])
        .filter((field) => field && typeof field !== 'string')
        .map((field) => {
          return {
            label: field.name,
            name: field.name,
            type: field.type,
          };
        });
    }
    // Setup editor auto complete
    this.editorService.addCalcAndKeysAutoCompleter(this.editor, [
      ...this.dataTemplateService.getAutoCompleterKeys(
        fields,
        this.widget.settings.aggregations
      ),
      ...this.dataTemplateService.getAutoCompleterPageKeys(),
    ]);
  }

  /**
   * Build the settings form, using the widget saved parameters.
   */
  public buildSettingsForm() {
    this.widgetFormGroup = createEditorForm(
      this.widget.id,
      this.widget.settings
    );
  }
}
