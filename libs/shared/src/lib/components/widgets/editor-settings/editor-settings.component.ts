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
import { GET_RESOURCE } from './graphql/queries';
import { get } from 'lodash';
import { DataTemplateService } from '../../../services/data-template/data-template.service';

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
export class EditorSettingsComponent implements OnInit, AfterViewInit {
  /** Widget configuration */
  @Input() widget: any;
  /** Widget form group */
  widgetFormGroup!: EditorFormType;
  /** Change event emitter */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();
  /** tinymce editor configuration */
  public editor: any = WIDGET_EDITOR_CONFIG;
  /** Current resource */
  public selectedResource: Resource | null = null;
  /** Current layout */
  public selectedLayout: Layout | null = null;

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
    this.widgetFormGroup = createEditorForm(this.widget);
    this.change.emit(this.widgetFormGroup);

    // Initialize the selected resource, layout and record from the form
    const resourceID = this.widgetFormGroup?.get('resource')?.value;
    const layoutID = this.widgetFormGroup?.get('layout')?.value;
    if (resourceID) {
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_RESOURCE,
          variables: {
            id: resourceID,
            layout: layoutID ? [layoutID] : undefined,
          },
        })
        .subscribe((res) => {
          if (res.data) {
            this.selectedResource = res.data.resource;
            if (layoutID) {
              this.selectedLayout =
                res.data?.resource.layouts?.edges[0]?.node || null;
              this.updateFields();
            }
          }
        });
    }
  }

  /**
   * Detect the form changes to emit the new configuration.
   */
  ngAfterViewInit(): void {
    this.widgetFormGroup?.valueChanges.subscribe(() => {
      this.change.emit(this.widgetFormGroup);
      this.widget.settings.text = this.widgetFormGroup.value.text;
      this.widget.settings.record = this.widgetFormGroup.value.record;
      this.widget.settings.title = this.widgetFormGroup.value.title;
      this.widget.settings.resource = this.widgetFormGroup.value.resource;
      this.widget.settings.layout = this.widgetFormGroup.value.layout;
    });
    this.updateFields();
  }

  /** Extracts the fields from the resource/layout */
  public updateFields() {
    // extract data keys from metadata
    const fields: any = [];
    get(this.selectedResource, 'metadata', []).forEach((metaField: any) => {
      get(this.selectedLayout, 'query.fields', []).forEach((field: any) => {
        if (field.name === metaField.name) {
          const type = metaField.type;
          fields.push({ ...field, type });
        }
      });
    });
    // Setup editor auto complete
    this.editorService.addCalcAndKeysAutoCompleter(this.editor, [
      ...this.dataTemplateService.getAutoCompleterKeys(fields),
      ...this.dataTemplateService.getAutoCompleterPageKeys(),
    ]);
  }
}
