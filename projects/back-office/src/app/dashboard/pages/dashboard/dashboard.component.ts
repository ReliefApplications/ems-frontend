import { Apollo } from 'apollo-angular';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Dashboard,
  SafeSnackBarService,
  SafeApplicationService,
  SafeWorkflowService,
  SafeDashboardService,
  SafeAuthService,
  Application,
  SafeUnsubscribeComponent,
} from '@safe/builder';
import { ShareUrlComponent } from './components/share-url/share-url.component';
import {
  EditDashboardMutationResponse,
  EDIT_DASHBOARD,
  EditPageMutationResponse,
  EDIT_PAGE,
  EditStepMutationResponse,
  EDIT_STEP,
} from './graphql/mutations';
import {
  GetDashboardByIdQueryResponse,
  GET_DASHBOARD_BY_ID,
} from './graphql/queries';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

/**
 * Dashboard page.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnDestroy
{
  // === DATA ===
  public id = '';
  public applicationId?: string;
  public loading = true;
  public tiles: any[] = [];
  public dashboard?: Dashboard;

  // === GRID ===
  private generatedTiles = 0;

  // === DASHBOARD NAME EDITION ===
  public formActive = false;
  public dashboardNameForm: UntypedFormGroup = new UntypedFormGroup({});

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  // === DUP APP SELECTION ===
  public showAppMenu = false;
  public applications: Application[] = [];

  /**
   * Dashboard page
   *
   * @param applicationService Shared application service
   * @param workflowService Shared workflow service
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param router Angular router
   * @param dialog Material dialog service
   * @param snackBar Shared snackbar service
   * @param dashboardService Shared dashboard service
   * @param translateService Angular translate service
   * @param authService Shared authentication service
   */
  constructor(
    private applicationService: SafeApplicationService,
    private workflowService: SafeWorkflowService,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private dashboardService: SafeDashboardService,
    private translateService: TranslateService,
    private authService: SafeAuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.formActive = false;
      this.loading = true;
      this.id = params.id;
      this.apollo
        .query<GetDashboardByIdQueryResponse>({
          query: GET_DASHBOARD_BY_ID,
          variables: {
            id: this.id,
          },
        })
        .subscribe({
          next: ({ data, loading }) => {
            if (data.dashboard) {
              this.dashboard = data.dashboard;
              this.dashboardService.openDashboard(this.dashboard);
              this.dashboardNameForm = new UntypedFormGroup({
                dashboardName: new UntypedFormControl(
                  this.dashboard.name,
                  Validators.required
                ),
              });
              this.tiles = data.dashboard.structure
                ? [...data.dashboard.structure]
                : [];
              this.generatedTiles =
                this.tiles.length === 0
                  ? 0
                  : Math.max(...this.tiles.map((x) => x.id)) + 1;
              this.applicationId = this.dashboard.page
                ? this.dashboard.page.application?.id
                : this.dashboard.step
                ? this.dashboard.step.workflow?.page?.application?.id
                : '';
              this.loading = loading;
            } else {
              this.snackBar.openSnackBar(
                this.translateService.instant(
                  'common.notifications.accessNotProvided',
                  {
                    type: this.translateService
                      .instant('common.dashboard.one')
                      .toLowerCase(),
                    error: '',
                  }
                ),
                { error: true }
              );
              this.router.navigate(['/applications']);
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            this.router.navigate(['/applications']);
          },
        });
    });
  }

  /**
   * Leave dashboard
   */
  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dashboardService.closeDashboard();
  }

  /**
   * Add a new widget to the dashboard.
   *
   * @param e add event
   */
  onAdd(e: any): void {
    const tile = JSON.parse(JSON.stringify(e));
    tile.id = this.generatedTiles;
    this.generatedTiles += 1;
    this.tiles = [...this.tiles, tile];
    this.autoSaveChanges();
    // scroll to the element once it is created
    setTimeout(() => {
      const el = document.getElementById(`widget-${tile.id}`);
      el?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /**
   * Edits the settings or display of a widget.
   *
   * @param e widget to save.
   */
  onEditTile(e: any): void {
    // make sure that we save the default layout.
    const index = this.tiles.findIndex((v: any) => v.id === e.id);
    const options = this.tiles[index]?.settings?.defaultLayout
      ? {
          ...e.options,
          defaultLayout: this.tiles[index].settings.defaultLayout,
        }
      : e.options;
    if (options) {
      switch (e.type) {
        case 'display': {
          this.tiles = this.tiles.map((x) => {
            if (x.id === e.id) {
              x = {
                ...x,
                defaultCols: options.cols,
                defaultRows: options.rows,
              };
            }
            return x;
          });
          this.autoSaveChanges();
          break;
        }
        case 'data': {
          this.tiles = this.tiles.map((x) => {
            if (x.id === e.id) {
              x = { ...x, settings: options };
            }
            return x;
          });
          this.autoSaveChanges();
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  /**
   * Remove a widget from the dashboard.
   *
   * @param e delete event
   */
  onDeleteTile(e: any): void {
    this.tiles = this.tiles.filter((x) => x.id !== e.id);
    this.autoSaveChanges();
  }

  /**
   * Drags and drops a widget to move it.
   *
   * @param e move event.
   */
  onMove(e: any): void {
    // Dups array, some times the arrays is write protected
    this.tiles = this.tiles.slice();
    [this.tiles[e.oldIndex], this.tiles[e.newIndex]] = [
      this.tiles[e.newIndex],
      this.tiles[e.oldIndex],
    ];
    this.autoSaveChanges();
  }

  /** Save the dashboard changes in the database. */
  private autoSaveChanges(): void {
    this.apollo
      .mutate<EditDashboardMutationResponse>({
        mutation: EDIT_DASHBOARD,
        variables: {
          id: this.id,
          structure: this.tiles,
        },
      })
      .subscribe({
        next: () => {
          this.dashboardService.openDashboard({
            ...this.dashboard,
            structure: this.tiles,
          });
        },
        complete: () => (this.loading = false),
      });
  }

  /**
   * Edit the permissions layer.
   *
   * @param e edit event
   */
  saveAccess(e: any): void {
    if (this.router.url.includes('/workflow/')) {
      this.apollo
        .mutate<EditStepMutationResponse>({
          mutation: EDIT_STEP,
          variables: {
            id: this.dashboard?.step?.id,
            permissions: e,
          },
        })
        .subscribe(({ data }) => {
          this.dashboard = {
            ...this.dashboard,
            permissions: data?.editStep.permissions,
          };
        });
    } else {
      this.apollo
        .mutate<EditPageMutationResponse>({
          mutation: EDIT_PAGE,
          variables: {
            id: this.dashboard?.page?.id,
            permissions: e,
          },
        })
        .subscribe(({ data }) => {
          this.dashboard = {
            ...this.dashboard,
            permissions: data?.editPage.permissions,
          };
        });
    }
  }

  /**
   * Toggle visibility of form.
   */
  toggleFormActive(): void {
    if (
      this.dashboard?.page
        ? this.dashboard.page.canUpdate
        : this.dashboard?.step?.canUpdate
    ) {
      this.formActive = !this.formActive;
    }
  }

  /** Update the name of the dashboard and the step or page linked to it. */
  saveName(): void {
    const { dashboardName } = this.dashboardNameForm.value;
    this.toggleFormActive();
    const callback = () => {
      this.dashboard = { ...this.dashboard, name: dashboardName };
    };
    if (this.router.url.includes('/workflow/')) {
      this.workflowService.updateStepName(
        {
          id: this.dashboard?.step?.id,
          name: dashboardName,
        },
        callback
      );
    } else {
      this.applicationService.updatePageName(
        {
          id: this.dashboard?.page?.id,
          name: dashboardName,
        },
        callback
      );
    }
  }

  /** Display the ShareUrl modal with the route to access the dashboard. */
  public onShare(): void {
    const url = `${window.origin}/share/${this.dashboard?.id}`;
    const dialogRef = this.dialog.open(ShareUrlComponent, {
      data: {
        url,
      },
    });
    dialogRef.afterClosed().subscribe();
  }

  /**
   * Duplicate page, in a new ( or same ) application
   *
   * @param event duplication event
   */
  public onDuplicate(event: any): void {
    if (this.dashboard?.page?.id) {
      this.applicationService.duplicatePage(this.dashboard?.page?.id, event.id);
    }
  }

  /**
   * Toggle visibility of application menu
   * Get applications
   */
  public onAppSelection(): void {
    this.showAppMenu = !this.showAppMenu;
    const authSubscription = this.authService.user$.subscribe(
      (user: any | null) => {
        if (user) {
          this.applications = user.applications;
        }
      }
    );
    authSubscription.unsubscribe();
  }
}
