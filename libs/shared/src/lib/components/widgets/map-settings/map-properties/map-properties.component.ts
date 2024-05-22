import { Component, Input } from '@angular/core';
import { FormArray, UntypedFormGroup } from '@angular/forms';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { MapConstructorSettings } from '../../../ui/map/interfaces/map.interface';
import { BASEMAPS } from '../../../ui/map/const/baseMaps';
import { DomPortal } from '@angular/cdk/portal';
import { createGeographicExtent } from '../map-forms';
import { WIDGET_EDITOR_CONFIG } from 'libs/shared/src/lib/const/tinymce.const';
import { RawEditorSettings } from 'tinymce';
import { EditorService } from 'libs/shared/src/lib/services/editor/editor.service';

/**
 * Map Properties of Map widget.
 */
@Component({
  selector: 'shared-map-properties',
  templateUrl: './map-properties.component.html',
  styleUrls: ['./map-properties.component.scss'],
})
export class MapPropertiesComponent extends UnsubscribeComponent {
  /** Current form group */
  @Input() form!: UntypedFormGroup;
  /** Map settings */
  @Input() mapSettings!: MapConstructorSettings;
  /** Map dom portal */
  @Input() mapPortal?: DomPortal;
  /** Available base maps */
  public baseMaps = BASEMAPS;
  /** Available geographic extent fields */
  public extents = ['admin0', 'region'];
  /** tinymce editor configuration */
  public editor: RawEditorSettings = {
    ...WIDGET_EDITOR_CONFIG,
    height: 200,
  };
  /** Is editor loading */
  public editorLoading = true;

  /** @returns geographic extents as form array */
  get geographicExtents() {
    return this.form.get('geographicExtents') as FormArray;
  }

  /** @returns the form group for the map controls */
  get controlsFormGroup() {
    return this.form.get('controls') as UntypedFormGroup;
  }

  /**
   * Map Properties of Map widget.
   *
   * @param editorService Editor service
   */
  constructor(private editorService: EditorService) {
    super();
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  /**
   * Set the latitude and longitude of the center of the map using the one in the preview map.
   */
  onSetByMap(): void {
    this.form
      .get('initialState.viewpoint')
      ?.setValue(this.mapSettings.initialState.viewpoint, {
        emitEvent: false,
      });
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
   * Add a new geographic extent mapping
   */
  onAddExtent(): void {
    this.geographicExtents.push(createGeographicExtent());
  }

  /**
   * Remove geographic extent mapping at index
   *
   * @param index index of element to remove
   */
  onDeleteExtent(index: number): void {
    this.geographicExtents.removeAt(index);
  }
}
