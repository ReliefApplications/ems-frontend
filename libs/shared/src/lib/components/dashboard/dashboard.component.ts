import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { WidgetGridComponent } from '../widget-grid/widget-grid.component';

/**
 * Shared dashboard component.
 * To be extended by other dashboards.
 */
@Component({
  selector: 'shared-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends UnsubscribeComponent {
  /** Widget grid reference */
  @ViewChild(WidgetGridComponent)
  public widgetGridComponent!: WidgetGridComponent;
  /** List of widgets */
  public widgets: any[] = [];
}
