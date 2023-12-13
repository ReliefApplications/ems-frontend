import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

/** Component for the map widget */
@Component({
  selector: 'shared-map-widget',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapWidgetComponent {
  /**
   * Settings
   */
  @Input() settings: any;
  /**
   * Data
   */
  @ViewChild('headerTemplate') headerTemplate!: TemplateRef<any>;
}
