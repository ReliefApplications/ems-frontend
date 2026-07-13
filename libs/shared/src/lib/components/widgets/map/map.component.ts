import { Component, Input, ViewChild } from '@angular/core';
import { MapComponent } from '../../ui/map';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';

/** Component for the map widget */
@Component({
  selector: 'shared-map-widget',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapWidgetComponent extends BaseWidgetComponent {
  /** Map settings */
  @Input() settings: any;
  /** Reference to map component */
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  /**
   * Reload the map layers' data.
   * Used to keep the map in sync after data is edited elsewhere on the dashboard.
   */
  public reload(): void {
    this.mapComponent?.reloadData();
  }
}
