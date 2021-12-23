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
  public currentLayoutIndex = 0;

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  constructor(
    private dashboardService: SafeDashboardService
  ) { }

  ngOnInit(): void {
    // this.layout = this.dashboardService.getWidgetLayout(this.widget);
    this.layout = {};
    this.layoutList = this.widget.settings.layoutList;
    const grid = this.dashboardService.getDashboardFields(this.widget.id);
    if (!grid.layoutList?.find((l: any) => l.defaultLayoutRecovery) && grid.defaultLayout && grid.component === 'grid') {
      this.dashboardService.addDefaultLayoutRecoveryToList(this.widget.id).subscribe((res) => {
        this.layoutList = res;
      });
    }
    this.currentLayoutIndex = this.dashboardService.getWidgetLayout(this.widget);
  }

  ngOnChanges(): void {
    this.layout = {};
    this.layoutList = this.widget.settings.layoutList;
  }

  public onLayoutChanged(e: any): void {
    this.dashboardService.saveWidgetLayout(this.widget.id, e);
  }

  public onLayoutListChanged(e: any): void {
    this.dashboardService.saveWidgetLayoutToList(this.widget.id, e).subscribe((res) => {
      this.layoutList = res;
    });
  }
}
