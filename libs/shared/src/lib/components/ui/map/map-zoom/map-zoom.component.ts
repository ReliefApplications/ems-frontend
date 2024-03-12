import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { MapEvent, MapEventType } from '../interfaces/map.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';

/** Zoom slider component for the map widget */
@Component({
  standalone: true,
  selector: 'shared-map-zoom',
  templateUrl: './map-zoom.component.html',
  styleUrls: ['./map-zoom.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class MapZoomComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Maximum zoom level */
  public maxZoom!: number;
  /** Minimum zoom level */
  public minZoom!: number;
  /** Map */
  public map: any;
  /** Current zoom level */
  public currentZoom = 4;
  /** Event emitter for the map events */
  public mapEvent!: EventEmitter<MapEvent>;

  /**
   * Map zoom component constructor
   */
  constructor() {
    super();
  }

  ngOnInit() {
    this.mapEvent.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event.type === MapEventType.ZOOM_END)
        this.currentZoom = event.content.zoom;
    });
  }

  /**
   * When value of input changes, calculates the position where the bubble is to go and sends the new value to the map
   *
   * @param value The value from the slider
   */
  onChangeFunction(value: EventTarget | null) {
    if (value) {
      this.map.setZoom(+((value as HTMLInputElement)?.value ?? value));
    }
  }

  /** Zooms in one level further */
  zoomIn() {
    if (this.currentZoom < this.maxZoom) this.map.setZoom(this.currentZoom + 1);
  }

  /** Zooms out of one level */
  zoomOut() {
    if (this.currentZoom > this.minZoom) this.map.setZoom(this.currentZoom - 1);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.mapEvent.unsubscribe();
  }
}
