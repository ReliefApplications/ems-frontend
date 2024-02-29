import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { WidgetGridComponent } from '../widget-grid/widget-grid.component';
import { DashboardAutomationService } from '../../services/dashboard-automation/dashboard-automation.service';

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
  providers: [DashboardAutomationService],
})
export class DashboardComponent extends UnsubscribeComponent {
  /** Widget grid reference */
  @ViewChild(WidgetGridComponent)
  public widgetGridComponent!: WidgetGridComponent;
  /** List of widgets */
  public widgets: any[] = [];
}
