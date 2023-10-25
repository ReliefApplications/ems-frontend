import { CommonModule } from '@angular/common';
import { Component, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MapComponent, MapModule } from '../../map';
import { MapLayersService } from '../../../../services/map/map-layers.service';
import { LayerDatasource } from '../../../../models/layer.model';
import get from 'lodash/get';
import { DialogModule, IconModule, TooltipModule } from '@oort-front/ui';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

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
  imports: [CommonModule, DialogModule, MapModule, IconModule, TooltipModule],
  selector: 'shared-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements AfterViewInit {
  @ViewChild(MapComponent) mapComponent?: MapComponent;

  /**
   * Modal to show markers in a map
   *
   * @param dialogRef Reference to the dialog
   * @param mapLayersService Service to create layers
   * @param data Dialog data
   */
  constructor(
    public dialogRef: DialogRef<MapModalComponent>,
    private mapLayersService: MapLayersService,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}

  ngAfterViewInit(): void {
    const mapComponent = this.mapComponent;
    if (!mapComponent) {
      return;
    }
    this.mapLayersService
      .createLayerFromDefinition(
        {
          id: '',
          name: '',
          visibility: true,
          opacity: 1,
          datasource: this.data.datasource,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        mapComponent.injector
      )
      .then((layer) => {
        mapComponent.addLayer(layer);
        const coordinates = get(
          this.data,
          `item[${this.data.datasource.geoField}].geometry.coordinates`,
          []
        );
        mapComponent.map.setView(coordinates.reverse(), 10);
      });
  }
}
