import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Dashboard, WhoSnackBarService, WhoApplicationService } from '@who-ems/builder';
import { ShareUrlComponent } from './components/share-url/share-url.component';
import {
  EditDashboardMutationResponse, EDIT_DASHBOARD,
  EditPageMutationResponse, EDIT_PAGE,
  EditStepMutationResponse, EDIT_STEP } from '../../../graphql/mutations';
import { GetDashboardByIdQueryResponse, GET_DASHBOARD_BY_ID } from '../../../graphql/queries';
import { Subscription } from 'rxjs';
import { WorkflowService } from '../../../services/workflow.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // === DATA ===
  public id: string;
  public loading = true;
  public tiles = [];
  public dashboard: Dashboard;

  // === GRID ===
  private generatedTiles: number;

  // === DASHBOARD NAME EDITION ===
  public formActive: boolean;
  public dashboardNameForm: FormGroup;

  // === ROUTE ===
  private routeSubscription: Subscription;

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  constructor(
    private applicationService: WhoApplicationService,
    private workflowService: WorkflowService,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: WhoSnackBarService
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.formActive = false;
      this.loading = true;
      this.id = params.id;
      this.apollo.watchQuery<GetDashboardByIdQueryResponse>({
        query: GET_DASHBOARD_BY_ID,
        variables: {
          id: this.id
        }
      }).valueChanges.subscribe((res) => {
        if (res.data.dashboard) {
          this.dashboard = res.data.dashboard;
          this.dashboardNameForm = new FormGroup({
            dashboardName: new FormControl(this.dashboard.name, Validators.required)
          });
          this.tiles = res.data.dashboard.structure ? res.data.dashboard.structure : [];
          this.generatedTiles = this.tiles.length === 0 ? 0 : Math.max(...this.tiles.map(x => x.id)) + 1;
          console.log(JSON.parse(JSON.stringify(this.tiles)));
          this.loading = res.loading;
        } else {
          this.snackBar.openSnackBar('No access provided to this dashboard.', { error: true });
          this.router.navigate(['/dashboards']);
        }
      },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.router.navigate(['/dashboards']);
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  /*  Add a new widget to the dashboard.
  */
  onAdd(e: any): void {
    const tile = JSON.parse(JSON.stringify(e));
    tile.id = this.generatedTiles;
    this.generatedTiles += 1;
    this.tiles.push(tile);
    this.autoSaveChanges();
  }

  /*  Edit the settings or display of a widget.
  */
  onEditTile(e: any): void {
    const tile = this.tiles.find(x => x.id === e.id);
    const options = e.options;
    if (options) {
      switch (e.type) {
        case 'display': {
          tile.defaultCols = options.cols;
          tile.defaultRows = options.rows;
          this.autoSaveChanges();
          break;
        }
        case 'data': {
          tile.settings = options;
          this.autoSaveChanges();
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  /*  Remove a widget from the dashboard.
  */
  onDeleteTile(e: any): void {
    this.tiles = this.tiles.filter(x => x.id !== e.id);
    this.autoSaveChanges();
  }

  /*  Drag and drop a widget to move it.
  */
  onMove(): void {
    this.autoSaveChanges();
  }

  /*  Save the dashboard changes in the database.
  */
  private autoSaveChanges(): void {
    this.apollo.mutate<EditDashboardMutationResponse>({
      mutation: EDIT_DASHBOARD,
      variables: {
        id: this.id,
        structure: this.tiles
      }
    }).subscribe(res => {
      this.tiles = res.data.editDashboard.structure;
    });
  }

  /*  Edit the permissions layer.
  */
  saveAccess(e: any): void {
    if (this.router.url.includes('/workflow/')) {
      this.apollo.mutate<EditStepMutationResponse>({
        mutation: EDIT_STEP,
        variables: {
          id: this.dashboard.step.id,
          permissions: e
        }
      }).subscribe(res => {
        this.dashboard.permissions = res.data.editStep.permissions;
      });
    } else {
      this.apollo.mutate<EditPageMutationResponse>({
        mutation: EDIT_PAGE,
        variables: {
          id: this.dashboard.page.id,
          permissions: e
        }
      }).subscribe(res => {
        this.dashboard.permissions = res.data.editPage.permissions;
      });
    }
  }

  toggleFormActive(): void {
    if (this.dashboard.page ? this.dashboard.page.canUpdate : this.dashboard.step.canUpdate) { this.formActive = !this.formActive; }
  }

  /*  Update the name of the dashboard and the step or page linked to it.
  */
  saveName(): void {
    const { dashboardName } = this.dashboardNameForm.value;
    this.toggleFormActive();
    if (this.router.url.includes('/workflow/')) {
      this.apollo.mutate<EditStepMutationResponse>({
        mutation: EDIT_STEP,
        variables: {
          id: this.dashboard.step.id,
          name: dashboardName
        }
      }).subscribe(res => {
        this.dashboard.name = res.data.editStep.name;
        this.workflowService.updateStepName(res.data.editStep);
      });
    } else {
      this.apollo.mutate<EditPageMutationResponse>({
        mutation: EDIT_PAGE,
        variables: {
          id: this.dashboard.page.id,
          name: dashboardName
        }
      }).subscribe(res => {
        this.dashboard.name = res.data.editPage.name;
        this.applicationService.updatePageName(res.data.editPage);
      });
    }
  }

  /*  Display the ShareUrl modal with the route to access the dashboard.
  */
  public onShare(): void {
    const dialogRef = this.dialog.open(ShareUrlComponent, {
      data: {
        url: window.location
      }
    });
    dialogRef.afterClosed().subscribe();
  }
}
