import { Component, Input, ViewChild } from '@angular/core';
import { MapComponent } from '../../ui/map';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

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
   * Constructor for the map widget component
   *
   * @param sanitizer Sanitizer
   */
  constructor(private sanitizer: DomSanitizer) {
    super();
  }

  /**
   * convert string to html
   *
   * @param value string value
   * @returns html value
   */
  public convertStringToHtml(value: string | undefined): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value || '');
  }
}
