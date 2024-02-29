import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MapComponent } from '../../ui/map';

/** Component for the map widget */
@Component({
  selector: 'shared-map-widget',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapWidgetComponent {
  /** Map settings */
  @Input() settings: any;
  /** Reference to header template */
  @ViewChild('headerTemplate') headerTemplate!: TemplateRef<any>;
  /** Reference to map component */
  @ViewChild(MapComponent) mapComponent!: MapComponent;
}
