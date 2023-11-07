import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DividerModule,
  CheckboxModule,
  RadioModule,
  TooltipModule,
} from '@oort-front/ui';
import { MapComponent } from '../../map.component';
import * as L from 'leaflet';
import { SidenavControlsMenuItemComponent } from '../sidenav-controls-menu-item/sidenav-controls-menu-item.component';
import { SidenavControlsMenuBasemapComponent } from '../sidenav-controls-menu-basemap/sidenav-controls-menu-basemap.component';

/**
 * component for the right sidenav
 */
@Component({
  selector: 'shared-sidenav-controls-menu',
  standalone: true,
  templateUrl: './sidenav-controls-menu.component.html',
  styleUrls: ['./sidenav-controls-menu.component.scss'],
  imports: [
    ButtonModule,
    CommonModule,
    DividerModule,
    TranslateModule,
    CheckboxModule,
    RadioModule,
    SidenavControlsMenuItemComponent,
    SidenavControlsMenuBasemapComponent,
    TooltipModule,
  ],
})
export class SidenavControlsMenuComponent implements OnInit {
  @Input() layersMenuExpanded = false;
  @Input() layersTree!: L.Control.Layers.TreeObject[];
  @Input() basemaps!: L.Control.Layers.TreeObject[];
  @Input() mapComponent!: MapComponent;
  @Output() cancel = new EventEmitter();

  public map!: L.Map;

  ngOnInit(): void {
    this.map = this.mapComponent.map;
  }

  /** Opens the layers menu */
  openLayersMenu() {
    this.layersMenuExpanded = true;
  }

  /**
   * returns an array of flattened basemaps
   *
   * @param basemapsTree the nested array of basemaps
   * @param {L.Layer[]} layers the array of flattened basemaps
   * @returns the array of flattened basemaps
   */
  getAllBasemaps(
    basemapsTree: L.Control.Layers.TreeObject[],
    layers: L.Layer[] = []
  ) {
    for (const basemap of basemapsTree) {
      if (basemap.layer && basemap.layer) {
        layers.push(basemap.layer);
      }
      if (basemap.children) {
        this.getAllBasemaps(basemap.children, layers);
      }
    }
    return layers;
  }

  /**
   * Closes the sidenav
   */
  closeMenu(): void {
    this.cancel.emit(true);
  }
}
