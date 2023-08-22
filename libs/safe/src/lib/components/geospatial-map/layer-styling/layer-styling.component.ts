import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';

/** Leaflet */
import * as L from 'leaflet';
import { GeometryType } from '../../ui/map/interfaces/layer-settings.type';

/** Component for styling leaflet layers */
@Component({
  selector: 'safe-layer-styling',
  templateUrl: './layer-styling.component.html',
  styleUrls: ['./layer-styling.component.scss'],
})
export class LayerStylingComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  private _selectedLayer?: L.Layer;

  /** Sets the selected layer */
  @Input() set selectedLayer(value: any) {
    // eslint-disable-next-line no-underscore-dangle
    this._selectedLayer = value;
    this.updateForm();
  }

  /** @returns the selected layer */
  get selectedLayer(): any {
    // eslint-disable-next-line no-underscore-dangle
    return this._selectedLayer;
  }

  /** @returns the geometry type of the selected layer */
  get selectedLayerType(): GeometryType | null {
    // If the layer is a circle, can be considered as a polygon for styling purposes
    if (this.selectedLayer instanceof L.Circle) return 'Polygon';

    // Return geometry type if it is a valid type
    if (this.selectedLayer instanceof L.Polygon) return 'Polygon';
    if (this.selectedLayer instanceof L.Marker) return 'Point';

    // Otherwise, return null
    return null;
  }

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<typeof this.styleForm.value>();

  public styleForm!: ReturnType<typeof this.getStyleForm>;

  /** Component for styling leaflet layers */
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.updateForm();
  }

  /** Updates the form */
  private updateForm() {
    this.styleForm = this.getStyleForm();
    if (!this.styleForm) return;

    this.styleForm.patchValue(this.selectedLayer.options);

    const formValueChanges$ = this.styleForm.valueChanges as Observable<
      typeof this.styleForm.value
    >;

    formValueChanges$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.edit.emit(value);
    });
  }

  /**
   * Returns the form for the selected layer
   *
   * @returns the form for the selected layer
   */
  private getStyleForm() {
    switch (this.selectedLayerType) {
      case 'Point':
        return new FormGroup({
          color: new FormControl('#3388ff'),
          opacity: new FormControl(1.0),
        });
      case 'Polygon':
        return new FormGroup({
          color: new FormControl('#3388ff'),
          weight: new FormControl(3),
          opacity: new FormControl(1.0),
          fill: new FormControl(true),
          fillColor: new FormControl('#3388ff'),
          fillOpacity: new FormControl(0.2),
        });
      default:
        return new FormGroup({});
    }
  }
}
