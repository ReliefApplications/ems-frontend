import { Injectable } from '@angular/core';
import { AVAILABLE_TILES } from '../utils/available-tiles';

@Injectable({
  providedIn: 'root',
})
/*  Grid service for the dashboards.
  Expose the available tiles, and find the settings from a widget.
*/
export class SafeGridService {

  // === LIST OF DEFAULT WIDGETS AVAILABLE ===
  public availableTiles = AVAILABLE_TILES;

  constructor() { }

  /*  Find the settings component from the widget passed as 'tile'.
  */
  public findSettingsTemplate(tile: any): any {
    const availableTile = this.availableTiles.find(x => x.component === tile.component);
    return availableTile && availableTile.settingsTemplate ? availableTile.settingsTemplate : null;
  }
}
