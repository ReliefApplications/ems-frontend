import { Component } from '@angular/core';
import { SafeButtonModule } from '../../button/button.module';
import { CommonModule } from '@angular/common';
import { SafeDividerModule } from '../../divider/divider.module';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonSize } from '../../../ui/button/button-size.enum';

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
  public buttonSize = ButtonSize;

  /** Opens the layers menu */
  openLayersMenu() {
    this.layersMenuExpanded = true;
    this.bookmarksMenuExpanded = false;
    this.mapContainer
      .querySelector('.leaflet-control-layers')
      ?.classList.remove('hidden');
    this.openMenu();
  }

  /** Opens the bookmarks menu */
  openBookmarksMenu() {
    this.bookmarksMenuExpanded = true;
    this.layersMenuExpanded = false;
    this.mapContainer
      .querySelector('.leaflet-control-layers')
      ?.classList.add('hidden');
    this.openMenu();
  }

  /**
   * Update menu style
   */
  private openMenu() {
    this.mapContainer
      .querySelector('.leaflet-top.leaflet-right')
      ?.classList.add('bg-white');
    this.mapContainer
      .querySelector('.leaflet-top.leaflet-right')
      ?.classList.add('shadow-2lg');
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
    this.mapContainer
      .querySelector('.leaflet-top.leaflet-right')
      ?.classList.remove('shadow-2lg');
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
