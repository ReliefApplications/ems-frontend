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
}
