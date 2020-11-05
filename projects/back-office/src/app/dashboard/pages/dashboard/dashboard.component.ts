import { Component, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Dashboard, WhoSnackBarService } from 'who-shared';
import { CdkDropList, CdkDragEnter, moveItemInArray } from '@angular/cdk/drag-drop';
import { ShareUrlComponent } from './components/share-url/share-url.component';
import { EditDashboardMutationResponse, EDIT_DASHBOARD } from '../../../graphql/mutations';
import { GetDashboardByIdQueryResponse, GET_DASHBOARD_BY_ID } from '../../../graphql/queries';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // === DATA ===
  public id: string;
  public loading = true;
  public tiles = [];
  public dashboard: Dashboard;

  // === GRID ===
  @ViewChildren(CdkDropList) dropsQuery: QueryList<CdkDropList>;
  drops: CdkDropList[];
  colsNumber = 8;
  private generatedTiles: number;

  // === DASHBOARD NAME EDITION ===
  public formActive: boolean;
  public dashboardNameForm: FormGroup;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: WhoSnackBarService
  ) { }

  ngOnInit(): void {
    this.formActive = false;
    this.id = this.route.snapshot.params.id;
    this.colsNumber = this.setColsNumber(window.innerWidth);
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
  }

  /*  Change display when windows size changes.
  */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.colsNumber = this.setColsNumber(event.target.innerWidth);
  }

  /*  Add a new widget to the dashboard.
  */
  onAdd(e: any) {
    const tile = JSON.parse(JSON.stringify(e));
    tile.id = this.generatedTiles;
    this.generatedTiles += 1;
    this.tiles.push(tile);
    this.autoSaveChanges();
  }

  /*  Edit the settings or display of a widget.
  */
  onEditTile(e: any) {
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
  onDeleteTile(e: any) {
    this.tiles = this.tiles.filter(x => x.id !== e.id);
    this.autoSaveChanges();
  }

  /*  Change the number of displayed columns.
  */
  private setColsNumber(width: number) {
    if (width <= 480) {
      return 1;
    }
    if (width <= 600) {
      return 2;
    }
    if (width <= 800) {
      return 4;
    }
    if (width <= 1024) {
      return 6;
    }
    return 8;
  }

  /*  Drag and drop a widget to move it.
  */
  onMove($event: CdkDragEnter) {
    moveItemInArray(this.tiles, $event.item.data, $event.container.data);
    this.autoSaveChanges();
  }

  /*  Material grid once template ready.
  */
  ngAfterViewInit() {
    this.dropsQuery.changes.subscribe(() => {
      this.drops = this.dropsQuery.toArray();
    });
    Promise.resolve().then(() => {
      this.drops = this.dropsQuery.toArray();
    });
  }

  /*  Save the dashboard changes in the database.
  */
  private autoSaveChanges() {
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
  saveAccess(e: any) {
    this.apollo.mutate<EditDashboardMutationResponse>({
      mutation: EDIT_DASHBOARD,
      variables: {
        id: this.id,
        permissions: e
      }
    }).subscribe(res => {
      this.dashboard = res.data.editDashboard;
    });
  }

  toggleFormActive = () => this.formActive = !this.formActive;

  /*  Update the name of the dashboard.
  */
  saveName() {
    const { dashboardName } = this.dashboardNameForm.value;
    this.toggleFormActive();
    this.apollo.mutate<EditDashboardMutationResponse>({
      mutation: EDIT_DASHBOARD,
      variables: {
        id: this.id,
        name: dashboardName
      }
    }).subscribe(res => {
      this.dashboard.name = res.data.editDashboard.name;
    });
  }

  /*  Display the ShareUrl modal with the route to access the dashboard.
  */
  public onShare() {
    const dialogRef = this.dialog.open(ShareUrlComponent, {
      data: {
        url: window.location
      }
    });
    dialogRef.afterClosed().subscribe();
  }

}
