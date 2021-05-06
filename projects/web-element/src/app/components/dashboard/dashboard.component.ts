import { Component, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Dashboard, SafeLayoutService } from '@safe/builder';
import { Apollo } from 'apollo-angular';
import { GetDashboardByIdQueryResponse, GET_DASHBOARD_BY_ID } from '../../graphql/queries';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @Input() id: string = '';

  @ViewChild('rightSidenav', { read: ViewContainerRef }) rightSidenav?: ViewContainerRef;

  // === DATA ===
  public loading = true;
  public tiles = [];
  public dashboard?: Dashboard;

  // === DISPLAY ===
  public showSidenav = false;

  constructor(
    private apollo: Apollo,
    private layoutService: SafeLayoutService
  ) { }

  ngOnInit(): void {
    console.log(this.id);
    this.apollo.watchQuery<GetDashboardByIdQueryResponse>({
      query: GET_DASHBOARD_BY_ID,
      variables: {
        id: this.id
      }
    }).valueChanges.subscribe((res) => {
      if (res.data.dashboard) {
        this.dashboard = res.data.dashboard;
        this.tiles = res.data.dashboard.structure ? res.data.dashboard.structure : [];
        this.loading = res.loading;
      }
    });
    this.layoutService.rightSidenav.subscribe(view => {
      if (view && this.rightSidenav) {
        // this is necessary to prevent have more than one history component at the same time.
        this.layoutService.setRightSidenav(null);
        this.showSidenav = true;
        const componentRef: ComponentRef<any> = this.rightSidenav.createComponent(view.factory);
        for (const [key, value] of Object.entries(view.inputs)) {
          componentRef.instance[key] = value;
        }
        componentRef.instance.cancel.subscribe(() => {
          componentRef.destroy();
          this.layoutService.setRightSidenav(null);
        });
      } else {
        this.showSidenav = false;
        if (this.rightSidenav) {
          this.rightSidenav.clear();
        }
      }
    });
  }

  ngOnChanges(): void {
    this.apollo.watchQuery<GetDashboardByIdQueryResponse>({
      query: GET_DASHBOARD_BY_ID,
      variables: {
        id: this.dashboard
      }
    }).valueChanges.subscribe((res) => {
      if (res.data.dashboard) {
        this.dashboard = res.data.dashboard;
        this.tiles = res.data.dashboard.structure ? res.data.dashboard.structure : [];
        this.loading = res.loading;
      }
    });
  }

}
