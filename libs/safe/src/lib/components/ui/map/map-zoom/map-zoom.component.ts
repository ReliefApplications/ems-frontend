import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { MapEvent, MapEventType } from '../interfaces/map.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/** Zoom slider component for the map widget */
@Component({
  standalone: true,
  selector: 'safe-map-zoom',
  templateUrl: './map-zoom.component.html',
  styleUrls: ['./map-zoom.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class MapZoomComponent implements OnInit, OnDestroy {
  public maxZoom!: number;
  public minZoom!: number;
  public map: any;
  public currentZoom!: number;
  public mapEvent!: EventEmitter<MapEvent>;

  ngOnInit() {
    this.currentZoom = 4;
    this.mapEvent.subscribe((event) => {
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
      this.currentZoom = +((value as HTMLInputElement)?.value ?? value);
      this.map.setZoom(this.currentZoom);
    }
  }

  /** Zooms in one level further */
  zoomIn() {
    if (this.currentZoom < this.maxZoom) this.currentZoom += 1;
    this.map.setZoom(this.currentZoom);
  }

  /** Zooms out of one level */
  zoomOut() {
    if (this.currentZoom > this.minZoom) this.currentZoom -= 1;
    this.map.setZoom(this.currentZoom);
  }

  ngOnDestroy(): void {
    this.mapEvent.unsubscribe();
  }
}
