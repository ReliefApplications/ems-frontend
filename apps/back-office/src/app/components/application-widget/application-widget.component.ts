import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  SkipSelf,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  Router,
} from '@angular/router';
import {
  Application,
  ContentType,
  Page,
  SafeApplicationWidgetService,
  SafeAuthService,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';
import { Subscription, filter, takeUntil } from 'rxjs';
import { FormsComponent } from '../../dashboard/pages/forms/forms.component';
import { DashboardComponent } from '../../dashboard/pages/dashboard/dashboard.component';
import { FormBuilderComponent } from '../../dashboard/pages/form-builder/form-builder.component';
import { TabComponent } from '@oort-front/ui';
import { Location } from '@angular/common';

/**
 * Tabs for application widget
 */
interface PageTab {
  label: string;
  icon?: string;
  route: string;
  id?: string;
}

/**
 * Application widget component
 */
@Component({
  selector: 'app-application-widget',
  templateUrl: './application-widget.component.html',
  styleUrls: ['./application-widget.component.scss'],
  providers: [SafeApplicationWidgetService],
})
export class ApplicationWidgetComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnDestroy
{
  // === DATA ===
  widget: any;
  pages: PageTab[] = [];
  addPageTab: PageTab = {
    label: '',
    icon: 'add_circle',
    route: 'add-page',
  } as const;
  application!: Application;

  // === PERMISSIONS ===
  canCreateRecords = false;
  // === VERIFICATION IF USER IS ADMIN ===
  isAdmin!: boolean;

  // === SETTINGS ===
  header = true;
  settings: any = null;
  canUpdate = false;
  selectedTab = 0;
  status: {
    message?: string;
    error: boolean;
  } = { error: false };

  // === EMIT EVENT ===
  edit: EventEmitter<any> = new EventEmitter();

  // === PAGES EVENTS === //
  private subscriptions: Subscription = new Subscription();
  currentTabContent!: any;
  lastOpenedTab!: TabComponent;

  /**
   * Test if the grid uses a layout, and if a layout is used, if any item is currently updated.
   *
   * @returns Tell if component could block navigation
   */
  get canDeactivate() {
    return '';
  }

  /**
   * Tabs widget constructor
   *
   * @param environment environment token
   * @param router Router
   * @param activatedRoute ActivatedRoute
   * @param safeAuthService SafeAuthService
   * @param applicationWidgetService SafeApplicationWidgetService
   * @param cdr ChangeDetectorRef
   * @param location Location
   */
  constructor(
    @Inject('environment') environment: any,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private safeAuthService: SafeAuthService,
    @SkipSelf() private applicationWidgetService: SafeApplicationWidgetService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {
    super();
    this.isAdmin =
      this.safeAuthService.userIsAdmin && environment.module === 'backoffice';
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
          this.setCurrentTabContentListeners();
        }
        if (event instanceof NavigationCancel) {
          // Restore default url state
          if (this.currentTabContent instanceof FormBuilderComponent) {
            const regex = /(?=(^.*)\/tab0)/im;
            if (regex) {
              const baseRoute = this.location.path().match(regex)?.[1];
              if (baseRoute) {
                this.location.replaceState(baseRoute);
              }
            }
          }
        }
      },
    });
  }

  ngOnInit(): void {
    console.log(this.router.routerState.snapshot);
    this.setUpListeners();
    if (this.applicationWidgetService.widgetState) {
      this.header =
        this.applicationWidgetService.widgetState.header ?? this.header;
      this.widget =
        this.applicationWidgetService.widgetState.widget ?? this.widget;
      this.settings =
        this.applicationWidgetService.widgetState.widget?.settings ??
        this.settings;
    }
    if (this.settings?.applicationId) {
      this.applicationWidgetService.loadApplication(
        this.settings.applicationId
      );
    } else {
      this.applicationWidgetService.createApplication();
    }
  }

  /**
   * Set up page listeners for application widget
   */
  private setUpListeners() {
    this.applicationWidgetService.application
      .pipe(
        filter((app) => !!app),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (application) => {
          if (application) {
            this.updateApplicationWidgetUI(application);
          }
          if (application?.id) {
            this.settings.applicationId = application.id;
            this.settings = {
              ...this.settings,
              pages: this.pages.filter((p) => !!p.id),
            };
            this.applicationWidgetService.applicationWidgetTile.next(
              this.settings
            );
          }
          this.application = application ?? this.application;
        },
      });
  }

  /**
   * Update current application content displayed in the widget
   *
   * @param application Current application content
   */
  private updateApplicationWidgetUI(application: Application) {
    this.updateTabs(application.pages?.length ? application.pages : []);
    if (
      this.selectedTab === 0 ||
      this.application?.pages?.length !== application.pages?.length
    ) {
      const selectedIndex = !application.pages?.length
        ? -1
        : this.selectedTab === application.pages.length + 1
        ? application.pages.length
        : this.selectedTab
        ? this.selectedTab
        : this.selectedTab === 0 &&
          !this.application &&
          application.pages?.length
        ? 1
        : application.pages?.length;

      this.loadPage(selectedIndex);
      this.selectedTab = selectedIndex !== -1 ? selectedIndex : 0;
    }
  }
  /**
   * Set to view the page for the given index
   *
   * @param pageIndex index of page to load
   */
  loadPage(pageIndex: number) {
    const page =
      pageIndex !== -1
        ? this.pages[pageIndex]
        : ({ route: 'add-page' } as PageTab);
    const route = `./${page.route}${page.id ? '/' + page.id : ''}`;
    this.router.navigate([route], {
      relativeTo: this.activatedRoute,
      skipLocationChange: true,
      state: { applicationWidgetService: this.applicationWidgetService },
    });
  }

  /**
   * Delete page for the given index
   *
   * @param event click event
   * @param pageIndex index of page to delete
   */
  removePage(event: MouseEvent, pageIndex: number) {
    event.preventDefault();
    event.stopPropagation();
    const pageToDelete = this.pages[pageIndex];
    if (pageToDelete.id) {
      this.applicationWidgetService.deletePage(pageToDelete.id);
    }
  }

  /**
   * Handle each page type subscriptions and listeners on rendering them
   *
   */
  setCurrentTabContentListeners() {
    this.subscriptions.unsubscribe();
    if (this.currentTabContent instanceof FormsComponent) {
      console.log(this.currentTabContent);
    } else if (this.currentTabContent instanceof DashboardComponent) {
      console.log(this.currentTabContent);
    } else if (this.currentTabContent instanceof FormBuilderComponent) {
      this.safeAuthService.canLogout.next(false);
    }
  }

  /**
   * Update current widget application tabs
   *
   * @param pages page collection
   */
  private updateTabs(pages: Page[]) {
    this.pages = [];
    if (pages.length) {
      this.pages.push(this.addPageTab);
    }
    pages.forEach((page) => {
      const newTab: PageTab = {
        label: page.name as string,
        icon: 'close',
        route: page.type as keyof typeof ContentType as string,
        id: page.id,
      };
      this.pages.push(newTab);
    });
    this.cdr.detectChanges();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subscriptions.unsubscribe();
  }

  /**
   * Disable current tabs if we are in the formBuilder(nested url that keeps confirmation modal)
   *
   * @returns disable state given the current tab content and state
   */
  get isDisabled() {
    return (
      this.currentTabContent instanceof FormBuilderComponent &&
      !this.safeAuthService.canLogout.getValue()
    );
  }
}
