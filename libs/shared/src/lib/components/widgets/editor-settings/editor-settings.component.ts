import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
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

// export type EditorFormType = ReturnType<typeof createEditorForm>;

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
  /** Widget configuration */
  @Input() widget: any;
  /** Widget form group */
  widgetFormGroup!: ReturnType<typeof createEditorForm>;
  /** Change event emitter */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();
  /** tinymce editor configuration */
  public editor: any = WIDGET_EDITOR_CONFIG;
  /** Current resource */
  public resource: Resource | null = null;
  /** Current reference data */
  public referenceData: ReferenceData | null = null;
  /** Current layout */
  public layout: Layout | null = null;
  /** boolean for check if added calc and keys auto completer */
  public addedCalcKeys = false;

  /**
   * Modal content for the settings of the editor widgets.
   *
   * @param editorService Editor service used to get main URL and current language
   * @param apollo Apollo service
   * @param dataTemplateService Shared data template service
   */
  constructor(
    private editorService: EditorService,
    private apollo: Apollo,
    private dataTemplateService: DataTemplateService
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
    this.widgetFormGroup = createEditorForm(
      this.widget.id,
      this.widget.settings
    );
    this.change.emit(this.widgetFormGroup);

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
      .subscribe((value) => {
        if (value) {
          this.widgetFormGroup.controls.referenceData.setValue(null);
          this.widgetFormGroup.controls.showDataSourceLink.enable();
          this.getResource(value);
        } else {
          this.resource = null;
          this.layout = null;
        }
      });
    // Subscribe to layout changes
    this.widgetFormGroup.controls.layout.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value && this.resource) {
          this.getResource(this.resource.id as string, value);
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
      .subscribe((value) => {
        if (value) {
          this.widgetFormGroup.controls.resource.setValue(null);
          this.widgetFormGroup.controls.showDataSourceLink.disable();
          this.getReferenceData(value);
        } else {
          this.referenceData = null;
        }
      });
  }

  /**
   * Detect the form changes to emit the new configuration.
   */
  ngAfterViewInit(): void {
    this.widgetFormGroup?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.widgetFormGroup.markAsDirty({ onlySelf: true });
        this.change.emit(this.widgetFormGroup);
        // todo: check if relevant
        this.widget.settings.text = this.widgetFormGroup.value.text;
        this.widget.settings.record = this.widgetFormGroup.value.record;
        this.widget.settings.title = this.widgetFormGroup.value.title;
        this.widget.settings.resource = this.widgetFormGroup.value.resource;
        this.widget.settings.layout = this.widgetFormGroup.value.layout;
        this.widget.settings.showDataSourceLink =
          this.widgetFormGroup.value.showDataSourceLink;
      });
    this.updateFields();
  }

  /**
   * Get resource for widget configuration
   *
   * @param resource selected resource id
   * @param layout selected layout id ( optional )
   */
  private getResource(resource: string, layout?: string | null) {
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id: resource,
          layout: layout ? [layout] : undefined,
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.resource = res.data.resource;
          if (layout) {
            this.layout = res.data?.resource.layouts?.edges[0]?.node || null;
          } else {
            this.layout = null;
          }
          this.updateFields();
        }
      });
  }

  /**
   * Get reference data by id
   *
   * @param referenceData reference data id
   */
  private getReferenceData(referenceData: string) {
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
    // if not added calc and keys yet add
    if (!this.addedCalcKeys) {
      this.editorService.addCalcAndKeysAutoCompleter(this.editor, [
        ...this.dataTemplateService.getAutoCompleterKeys(fields),
        ...this.dataTemplateService.getAutoCompleterPageKeys(),
      ]);
      this.addedCalcKeys = true;
      // otherwise update it
    } else {
      this.editorService.updateCalcAndKeysAutoCompleter(this.editor, [
        ...this.dataTemplateService.getAutoCompleterKeys(fields),
        ...this.dataTemplateService.getAutoCompleterPageKeys(),
      ]);
    }
  }
}
