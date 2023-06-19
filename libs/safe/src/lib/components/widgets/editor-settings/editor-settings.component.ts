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
import { SafeEditorService } from '../../../services/editor/editor.service';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { Resource } from '../../../models/resource.model';
import { Layout } from '../../../models/layout.model';
import { Apollo } from 'apollo-angular';
import { GET_RESOURCE, GetResourceByIdQueryResponse } from './graphql/queries';
import { get } from 'lodash';
import { getCalcKeys, getDataKeys } from '../summary-card/parser/utils';

/**
 * Creates the form for the editor widget settings.
 *
 * @param tile editor widget
 * @returns the editor widget form group
 */
const createEditorForm = (tile: any) => {
  const form = new FormGroup({
    id: new FormControl<string>(tile.id),
    title: new FormControl<string>(tile.settings.title),
    text: new FormControl<string>(tile.settings.text),

    // for record selection
    resource: new FormControl<string>(tile.settings.resource),
    layout: new FormControl<string>(tile.settings.layout),
    record: new FormControl<string>(tile.settings.record),
    useStyles: new FormControl<boolean>(tile.settings.useStyles),
  });

  return extendWidgetForm(form, tile?.settings?.widgetDisplay);
};

export type EditorFormType = ReturnType<typeof createEditorForm>;

/**
 * Modal content for the settings of the editor widgets.
 */
@Component({
  selector: 'safe-editor-settings',
  templateUrl: './editor-settings.component.html',
  styleUrls: ['./editor-settings.component.scss'],
})
export class SafeEditorSettingsComponent implements OnInit, AfterViewInit {
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
  public selectedLayout: Layout | null = null;
  /**
   * Modal content for the settings of the editor widgets.
   *
   * @param editorService Editor service used to get main URL and current language
   * @param apollo Apollo service
   */
  constructor(
    private editorService: SafeEditorService,
    private apollo: Apollo
  ) {
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  /**
   * Build the settings form, using the widget saved parameters.
   */
  ngOnInit(): void {
    this.tileForm = createEditorForm(this.tile);
    this.change.emit(this.tileForm);

    // Initialize the selected resource, layout and record from the form
    const resourceID = this.tileForm?.get('resource')?.value;
    const layoutID = this.tileForm?.get('layout')?.value;
    if (resourceID) {
      this.apollo
        .query<GetResourceByIdQueryResponse>({
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
    this.tileForm?.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
      this.tile.settings.text = this.tileForm.value.text;
      this.tile.settings.record = this.tileForm.value.record;
      this.tile.settings.title = this.tileForm.value.title;
      this.tile.settings.resource = this.tileForm.value.resource;
      this.tile.settings.layout = this.tileForm.value.layout;
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
    const dataKeys = getDataKeys(fields);
    const calcKeys = getCalcKeys();
    const keys = dataKeys.concat(calcKeys);
    // Setup editor auto complete
    this.editorService.addCalcAndKeysAutoCompleter(this.editor, keys);
  }
}
