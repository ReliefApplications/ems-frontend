import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DividerModule,
  CheckboxModule,
  RadioModule,
} from '@oort-front/ui';
import { MapComponent } from '../../map.component';
import * as L from 'leaflet';
import { LayersMenuItemComponent } from '../layers-menu-item/layers-menu-item.component';
import { LayersMenuBasemapComponent } from '../layers-menu-basemap/layers-menu-basemap.component';

/**
 * component for the right sidenav
 */
@Component({
  selector: 'safe-layers-menu',
  standalone: true,
  templateUrl: './layers-menu.component.html',
  styleUrls: ['./layers-menu.component.scss'],
  imports: [
    ButtonModule,
    CommonModule,
    DividerModule,
    TranslateModule,
    CheckboxModule,
    RadioModule,
    LayersMenuItemComponent,
    LayersMenuBasemapComponent,
  ],
})
export class SafeLayersMenuComponent implements OnInit {
  @Input() layersMenuExpanded = false;
  @Input() bookmarksMenuExpanded = false;
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
    this.bookmarksMenuExpanded = false;
  }

  /** Opens the bookmarks menu */
  openBookmarksMenu() {
    this.bookmarksMenuExpanded = true;
    this.layersMenuExpanded = false;
  }

  /** unchecks all basemaps */
  updateBasemaps() {
    console.log('should update the basemaps now');
  }
  /**
   * returns an array of flattened basemaps
   *
   * @param basemapsTree the nested array of basemaps
   * @param [layers=[]] the array of flattened basemaps
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
