import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LegendDefinition } from '../interfaces/layer-legend.type';
import { SafeIconDisplayModule } from '../../../../pipes/icon-display/icon-display.module';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, IconModule } from '@oort-front/ui';

/**
 * Map legend component
 */
@Component({
  standalone: true,
  selector: 'safe-map-legend',
  imports: [
    CommonModule,
    IconModule,
    ButtonModule,
    SafeIconDisplayModule,
    TranslateModule,
  ],
  templateUrl: './map-legend.component.html',
  styleUrls: ['./map-legend.component.scss'],
})
export class MapLegendComponent {
  public expanded = false;

  @Input() layerLegends: { legend: LegendDefinition; layer: string }[] = [];

  /** Toggle visibility of expanded control */
  public toggleVisibility(): void {
    this.expanded = !this.expanded;
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
    }[]
  ) {
    gradient.sort((a: any, b: any) => a.value - b.value);
    return (
      'linear-gradient(to top, ' +
      gradient.map((g) => `${g.color} ${g.value * 100}%`).join(', ') +
      ')'
    );
  }
}
