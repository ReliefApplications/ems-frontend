import { CommonModule } from '@angular/common';
import { Component, Inject, AfterViewInit, ViewChild } from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { SafeModalModule } from '../../modal/modal.module';
import { MapComponent, MapModule } from '../../map';
import { SafeMapLayersService } from '../../../../services/map/map-layers.service';
import { LayerDatasource } from '../../../../models/layer.model';
import get from 'lodash/get';

/**
 * Dialog data interface
 */
interface DialogData {
  item: any;
  datasource: LayerDatasource;
}

/**
 * Modal to show markers in a map
 */
@Component({
  standalone: true,
  imports: [CommonModule, SafeModalModule, MapModule],
  selector: 'safe-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements AfterViewInit {
  @ViewChild(MapComponent) mapComponent?: MapComponent;
  /**
   * Modal to show markers in a map
   *
   * @param dialogRef Reference to the dialog
   * @param data Dialog data
   */
  constructor(
    public dialogRef: MatDialogRef<MapModalComponent>,
    private mapLayersService: SafeMapLayersService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngAfterViewInit(): void {
    this.mapLayersService
      .createLayerFromDefinition({
        id: '',
        name: '',
        visibility: true,
        opacity: 1,
        datasource: this.data.datasource,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .then((layer) => {
        this.mapComponent?.addLayer(layer);
        const coordinates = get(
          this.data,
          `item[${this.data.datasource.geoField}].geometry.coordinates`,
          []
        );
        this.mapComponent?.map.setView(coordinates.reverse(), 10);
      });
  }
}
