import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SafeDashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'safe-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class SafeWidgetComponent implements OnInit {

  @Input() widget: any;
  @Input() header = true;
  public layout: any;

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  constructor(
    private dashboardService: SafeDashboardService
  ) { }

  ngOnInit(): void {
    this.layout = this.dashboardService.getWidgetLayout(this.widget);
  }

  public onLayoutChanged(e: any): void {
    this.dashboardService.saveWidgetLayout(this.widget.id, e);
  }

  public onDefaultLayoutChanged(e: any): void {
    this.dashboardService.saveWidgetDefaultLayout(this.widget.id, e);
  }
}
