import { Component, Inject, OnInit } from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import * as L from 'leaflet';

/**
 *
 */
interface MapData {
  markers: [number, number][];
  defaultZoom: number;
  defaultPosition: [number, number];
}
/**
 *
 */
@Component({
  selector: 'safe-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {
  /**
   * default constructor for the modal
   *
   * @param dialogRef Reference to the dialog
   * @param data The data used in the map
   */
  constructor(
    public dialogRef: MatDialogRef<MapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MapData
  ) {}

  ngOnInit(): void {
    const markers: L.LatLngExpression[] = this.data.markers.map((location) =>
      L.latLng(location)
    );
    console.log(markers);
    const map = L.map('map').setView(
      this.data.defaultPosition,
      this.data.defaultZoom
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    markers.forEach((marker) => {
      L.marker(marker).addTo(map);
    });
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 1000);
  }
}
