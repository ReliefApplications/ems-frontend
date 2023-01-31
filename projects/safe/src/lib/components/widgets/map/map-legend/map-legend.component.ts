import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LayerLegendI } from '../utils/layer';

/** Component for the map legend */
@Component({
  selector: 'safe-map-legend',
  templateUrl: './map-legend.component.html',
  styleUrls: ['./map-legend.component.scss'],
})
export class MapLegendComponent implements OnInit {
  @Input() layers: {
    name: string;
    legends: LayerLegendI[];
  }[] = [];

  public clicked = false;

  @Output() layerClick = new EventEmitter<LayerLegendI['layer']>();

  /** Component for the map legend */
  constructor() {}

  ngOnInit(): void {}

  /**
   * Emits the layer clicked
   *
   * @param layer The layer that corresponds to the legend clicked
   */
  onLayerClick(layer: LayerLegendI['layer']) {
    this.layerClick.emit(layer);
  }

  /**
   * Gets the css gradient
   *
   * @param gradient The gradient to get the css gradient from
   * @returns The css gradient string
   */
  getCssGradient(
    gradient: {
      value: number;
      color: string;
      label: string;
    }[]
  ) {
    return (
      'linear-gradient(to bottom, ' +
      gradient.map((g) => `${g.color} ${g.value * 100}%`).join(', ') +
      ')'
    );
  }
}
