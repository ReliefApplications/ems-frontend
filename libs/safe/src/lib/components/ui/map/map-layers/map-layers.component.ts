import { Component } from '@angular/core';
import { SafeButtonModule } from '../../button/button.module';
import { CommonModule } from '@angular/common';
import { SafeDividerModule } from '../../divider/divider.module';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Map layers component
 */
@Component({
  selector: 'safe-map-layers',
  standalone: true,
  imports: [SafeButtonModule, CommonModule, SafeDividerModule, TranslateModule],
  templateUrl: './map-layers.component.html',
  styleUrls: ['./map-layers.component.scss'],
})
export class MapLayersComponent {
  public layersMenuExpanded = false;
  public bookmarksMenuExpanded = false;
  public mapContainer!: HTMLElement;

  /** Opens the layers menu */
  openLayersMenu() {
    this.layersMenuExpanded = true;
    this.bookmarksMenuExpanded = false;
    this.mapContainer
      .querySelector('.leaflet-control-layers')
      ?.classList.remove('hidden');
    this.mapContainer
      .querySelector('.leaflet-top.leaflet-right')
      ?.classList.add('bg-white');
  }

  /** Opens the bookmarks menu */
  openBookmarksMenu() {
    this.bookmarksMenuExpanded = true;
    this.layersMenuExpanded = false;
    this.mapContainer
      .querySelector('.leaflet-control-layers')
      ?.classList.add('hidden');
    this.mapContainer
      .querySelector('.leaflet-top.leaflet-right')
      ?.classList.add('bg-white');
  }

  /** Closes the layers menu */
  closeLayersMenu() {
    this.layersMenuExpanded = false;
    this.bookmarksMenuExpanded = false;
    this.mapContainer
      .querySelector('.leaflet-control-layers')
      ?.classList.add('hidden');
    this.mapContainer
      .querySelector('.leaflet-top.leaflet-right')
      ?.classList.remove('bg-white');
  }

  /** Sets up */
  /*
  setLayersControl() {
    if (this.layerControl) {
      this.layerControl.setBaseTree(this.baseTree);
      this.layerControl.setOverlayTree(this.layersTree);
    } else {
      this.layerControl = L.control.layers.tree(
        this.baseTree,
        this.layersTree as any,
        { collapsed: false }
      );
    }
  }*/
}
