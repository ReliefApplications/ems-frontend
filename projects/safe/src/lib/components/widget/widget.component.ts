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
    const grid = this.dashboardService.getDashboardFields(this.widget.id);
    console.log(grid);
    if (!grid.layoutList?.find((l: any) => l.defaultLayoutRecovery) && grid.defaultLayout && grid.component === 'grid') {
      this.dashboardService.addDefaultLayoutRecoveryToList(this.widget.id).subscribe((res) => {
        this.layoutList = res;
      });
    }
  }

  ngOnChanges(): void {
    this.layout = this.dashboardService.getWidgetLayout(this.widget);
    // console.log('------- this.layout');
    // console.log(this.layout);
    this.layoutList = this.widget.settings.layoutList;
  }

  // public onLayoutChanged(e: any): void {
  //   console.log('onLayoutChanged');
  //   this.dashboardService.saveWidgetLayout(this.widget.id, e);
  // }

  public onLayoutChanged(e: any): void {
    console.log('onLayoutChanged');
    console.log('e');
    console.log(e);
    // this.dashboardService.saveWidgetLayout(this.widget.id, e);
  }

  public onDefaultLayoutChanged(e: any): void {
    console.log('onDefaultLayoutChanged');
    this.dashboardService.saveWidgetDefaultLayout(this.widget.id, e);
  }

  // public onDefaultLayoutChanged(e: any): void {
  //   console.log('onDefaultLayoutChanged');
  //   this.dashboardService.saveWidgetDefaultLayout(this.widget.id, e);
  // }

  public onDefaultLayoutReset(e: any): void {
    console.log('onDefaultLayoutReset');
    // this.dashboardService.resetDefaultWidgetLayout(this.widget.id);
    // this.layout = this.dashboardService.getWidgetLayout(this.widget);
  }

  public onLayoutListChanged(e: any): void {
    console.log('e');
    console.log(e);
    this.dashboardService.saveWidgetLayoutToList(this.widget.id, e).subscribe((res) => {
      this.layoutList = res;
      // this.dashboardService.saveWidgetLayout(this.widget.id, this.layoutList.length);
    });
  }
}
