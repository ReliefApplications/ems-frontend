import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, DividerModule } from '@oort-front/ui';
import { UILayoutService } from '@oort-front/ui';
import { SidenavControlsMenuComponent } from './sidenav-controls-menu/sidenav-controls-menu.component';
import { MapComponent } from '../map.component';

/**
 * Map layers component
 */
@Component({
  selector: 'shared-map-sidenav-controls',
  standalone: true,
  imports: [ButtonModule, CommonModule, DividerModule, TranslateModule],
  templateUrl: './map-sidenav-controls.component.html',
  styleUrls: ['./map-sidenav-controls.component.scss'],
})
export class MapSidenavControlsComponent {
  private layersTree!: L.Control.Layers.TreeObject[];
  private basemaps!: L.Control.Layers.TreeObject[];
  private mapComponent!: MapComponent;

  /**
   * Map layers component
   *
   * @param layoutService shared layout service
   */
  constructor(private layoutService: UILayoutService) {}

  /** Opens the layers menu */
  openLayersMenu() {
    this.openSidenavMenu(true);
  }

  /**
   * Opens the sidenav menu
   *
   * @param layersMenuExpanded true if we start with the layers expanded
   */
  openSidenavMenu(layersMenuExpanded: boolean) {
    this.layoutService.setRightSidenav({
      component: SidenavControlsMenuComponent,
      inputs: {
        layersMenuExpanded: layersMenuExpanded,
        layersTree: this.layersTree,
        basemaps: this.basemaps,
        mapComponent: this.mapComponent,
      },
    });
  }
}
