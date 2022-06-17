import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

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

@Component({
  selector: 'safe-map-properties',
  templateUrl: './map-properties.component.html',
  styleUrls: ['./map-properties.component.scss']
})
export class MapPropertiesComponent implements OnInit {

  @Input() form!: FormGroup;

  public basemaps = BASEMAPS;

  constructor() { }

  ngOnInit(): void {
  }

}
