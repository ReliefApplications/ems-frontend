import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { MapConstructorSettings } from '../../../ui/map/interfaces/map.interface';
import { BASEMAPS } from '../../../ui/map/const/baseMaps';
import { DomPortal } from '@angular/cdk/portal';

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
  public geographicExtents = ['admin0'];

  /** @returns the form group for the map controls */
  get controlsFormGroup() {
    return this.form.get('controls') as UntypedFormGroup;
  }

  /**
   * Map Properties of Map widget.
   */
  constructor() {
    super();
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
}
