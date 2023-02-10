import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SafeButtonModule } from '../../button/button.module';
import { SafeIconModule } from '../../icon/icon.module';

/**
 * Map legend component
 */
@Component({
  standalone: true,
  selector: 'safe-map-legend',
  imports: [CommonModule, SafeButtonModule, SafeIconModule],
  templateUrl: './map-legend.component.html',
  styleUrls: ['./map-legend.component.scss'],
})
export class SafeMapLegendComponent {
  public expanded = false;

  /** Toggle visibility of expanded control */
  public toggleVisibility(): void {
    this.expanded = !this.expanded;
  }
}
