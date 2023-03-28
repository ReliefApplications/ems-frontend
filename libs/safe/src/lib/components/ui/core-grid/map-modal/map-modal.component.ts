import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject } from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import * as L from 'leaflet';
import { SafeModalModule } from '../../modal/modal.module';

/**
 * Dialog data interface
 */
interface DialogData {
  markers: [number, number][];
  defaultZoom: number;
  defaultPosition: [number, number];
}

/**
 * Modal to show markers in a map
 */
@Component({
  standalone: true,
  imports: [CommonModule, SafeModalModule],
  selector: 'safe-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements AfterViewInit {
  /**
   * Modal to show markers in a map
   *
   * @param dialogRef Reference to the dialog
   * @param data Dialog data
   */
  constructor(
    public dialogRef: MatDialogRef<MapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngAfterViewInit(): void {
    const markers: L.LatLngExpression[] = this.data.markers.map((location) =>
      L.latLng(location)
    );
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
  }
}
