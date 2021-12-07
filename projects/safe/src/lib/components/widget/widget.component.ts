import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SafeDashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'safe-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class SafeWidgetComponent implements OnInit, OnChanges {

  @Input() widget: any;
  @Input() header = true;
  public layout: any;
  public layoutList: any;

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  constructor(
    private dashboardService: SafeDashboardService
  ) { }

  ngOnInit(): void {
    this.layout = this.dashboardService.getWidgetLayout(this.widget);
    this.layoutList = this.widget.settings.layoutList;
    console.log('this.layout: widget comp');
    console.log(this.layout);
  }

  ngOnChanges(): void {
    this.layout = this.dashboardService.getWidgetLayout(this.widget);
    this.layoutList = this.widget.settings.layoutList;
  }

  public onLayoutChanged(e: any): void {
    this.dashboardService.saveWidgetLayout(this.widget.id, e);
  }

  public onDefaultLayoutChanged(e: any): void {
    this.dashboardService.saveWidgetDefaultLayout(this.widget.id, e);
  }

  public onDefaultLayoutReset(e: any): void {
    this.dashboardService.resetDefaultWidgetLayout(this.widget.id);
    this.layout = this.dashboardService.getWidgetLayout(this.widget);
  }

  public onLayoutListChanged(e: any): void {
    this.layoutList = this.dashboardService.saveWidgetLayoutToList(this.widget.id, e);
  }
}
