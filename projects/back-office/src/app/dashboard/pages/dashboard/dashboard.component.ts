import { Apollo } from 'apollo-angular';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Dashboard,
  SafeSnackBarService,
  SafeApplicationService,
  SafeWorkflowService,
  SafeDashboardService,
  SafeAuthService,
  SafeTileDataComponent,
  Application,
} from '@safe/builder';
import { ShareUrlComponent } from './components/share-url/share-url.component';
import {
  EditDashboardMutationResponse,
  EDIT_DASHBOARD,
  EditPageMutationResponse,
  EDIT_PAGE,
  EditStepMutationResponse,
  EDIT_STEP,
} from '../../../graphql/mutations';
import {
  GetDashboardByIdQueryResponse,
  GET_DASHBOARD_BY_ID,
} from '../../../graphql/queries';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

/**
 * Dashboard page.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
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

  // === ROUTE ===
  private routeSubscription?: Subscription;

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
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
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
        .subscribe(
          (res) => {
            if (res.data.dashboard) {
              this.dashboard = res.data.dashboard;
              this.dashboardService.openDashboard(this.dashboard);
              this.dashboardNameForm = new UntypedFormGroup({
                dashboardName: new UntypedFormControl(
                  this.dashboard.name,
                  Validators.required
                ),
              });
              this.tiles = res.data.dashboard.structure
                ? [...res.data.dashboard.structure]
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
              this.loading = res.loading;
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
          (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            this.router.navigate(['/applications']);
          }
        );
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
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
      // automatically open the settings panel after scrolling
      // setTimeout(() => {
      //   const dialogRef = this.dialog.open(SafeTileDataComponent, {
      //     disableClose: true,
      //     data: {
      //       tile,
      //       template: this.dashboardService.findSettingsTemplate(tile),
      //     },
      //     // hasBackdrop: false,
      //     position: {
      //       bottom: '0',
      //       right: '0',
      //     },
      //     panelClass: 'tile-settings-dialog',
      //   });
      //   dialogRef.afterClosed().subscribe((res) => {
      //     if (res) {
      //       this.onEditTile({ type: 'data', id: tile.id, options: res });
      //     }
      //   });
      // }, 500);
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
      .subscribe(
        (res) => {
          this.dashboardService.openDashboard({
            ...this.dashboard,
            structure: this.tiles,
          });
        },
        (error) => (this.loading = false)
      );
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
        .subscribe((res) => {
          this.dashboard = {
            ...this.dashboard,
            permissions: res.data?.editStep.permissions,
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
        .subscribe((res) => {
          this.dashboard = {
            ...this.dashboard,
            permissions: res.data?.editPage.permissions,
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
    if (this.router.url.includes('/workflow/')) {
      this.apollo
        .mutate<EditStepMutationResponse>({
          mutation: EDIT_STEP,
          variables: {
            id: this.dashboard?.step?.id,
            name: dashboardName,
          },
        })
        .subscribe((res) => {
          if (res.data?.editStep) {
            this.dashboard = {
              ...this.dashboard,
              name: res.data?.editStep.name,
            };
            this.workflowService.updateStepName(res.data.editStep);
          } else {
            this.snackBar.openSnackBar(
              this.translateService.instant(
                'common.notifications.objectNotUpdated',
                {
                  type: this.translateService.instant('common.step.one'),
                  error: res.errors ? res.errors[0].message : '',
                }
              )
            );
          }
        });
    } else {
      this.apollo
        .mutate<EditPageMutationResponse>({
          mutation: EDIT_PAGE,
          variables: {
            id: this.dashboard?.page?.id,
            name: dashboardName,
          },
        })
        .subscribe((res) => {
          this.dashboard = { ...this.dashboard, name: res.data?.editPage.name };
          if (res.data?.editPage) {
            this.applicationService.updatePageName(res.data.editPage);
          }
        });
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
