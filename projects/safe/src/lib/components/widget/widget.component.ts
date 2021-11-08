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

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  constructor(
    private dashboardService: SafeDashboardService
  ) { }

  ngOnInit(): void {
    this.layout = this.dashboardService.getWidgetLayout(this.widget);
  }

  ngOnChanges(): void {
    this.layout = this.dashboardService.getWidgetLayout(this.widget);
  }

  public onLayoutChanged(e: any): void {
    this.dashboardService.saveWidgetLayout(this.widget.id, e);
  }

  public onDefaultLayoutChanged(e: any): void {
    console.log('this.widget');
    console.log(this.widget);
    console.log('this.layout');
    console.log(this.layout);
    this.dashboardService.saveWidgetDefaultLayout(this.widget.id, e);
    // this.defaultLayoutChangedEvent.emit({
    //   id: this.widget.id,
    //   layout: this.layout
    // });
  }

  public onDefaultLayoutReset(e: any): void {
    this.dashboardService.resetDefaultWidgetLayout(this.widget.id);
    this.layout = this.dashboardService.getWidgetLayout(this.widget);
  }
}
