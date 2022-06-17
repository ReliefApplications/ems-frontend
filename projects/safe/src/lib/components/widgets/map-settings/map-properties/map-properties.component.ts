import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

/** List of basemap that can be used by the widget */
const BASEMAPS: string[] = [
  'Sreets',
  'Navigation',
  'Topographic',
  'Light Gray',
  'Dark Gray',
  'Streets Relief',
  'Imagery',
  'ChartedTerritory',
  'ColoredPencil',
  'Nova',
  'Midcentury',
  'OSM',
  'OSM:Streets',
];

/**
 * Map Properties of Map widget.
 */
@Component({
  selector: 'safe-map-properties',
  templateUrl: './map-properties.component.html',
  styleUrls: ['./map-properties.component.scss'],
})
export class MapPropertiesComponent implements OnInit {
  @Input() form!: FormGroup;

  public basemaps = BASEMAPS;

  /**
   * Map Properties of Map widget.
   */
  constructor() {}

  ngOnInit(): void {}
}
