import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Application,
  ContentType,
  Page,
  SafeApplicationWidgetService,
  SafeAuthService,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';

import { Location } from '@angular/common';
import { Subscription, takeUntil } from 'rxjs';
import { AddPageComponent } from '../../application/pages/add-page/add-page.component';
import { FormsComponent } from '../../dashboard/pages/forms/forms.component';
import { DashboardComponent } from '../../dashboard/pages/dashboard/dashboard.component';

interface PageTab {
  label: string;
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
})
export class ApplicationWidgetComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  //   <safe-tabs-widget
  //   #widgetContent
  //   class="flex-1 h-full w-full"
  //   [header]="header"
  //   [settings]="widget.settings"
  //   (edit)="edit.emit($event)"
  //   [widget]="widget"
  // >
  // </safe-tabs-widget>
  // === DATA ===
  widget: any;
  tabs: PageTab[] = [];
  application!: Application;

  // === PERMISSIONS ===
  canCreateRecords = false;
  // === VERIFICATION IF USER IS ADMIN ===
  isAdmin!: boolean;

  // === SETTINGS ===
  header = true;
  settings: any = null;
  id = '';
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
   * @param location Location
   */
  constructor(
    @Inject('environment') environment: any,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private safeAuthService: SafeAuthService,
    private applicationWidgetService: SafeApplicationWidgetService,
    private location: Location
  ) {
    super();
    const data = this.router.getCurrentNavigation()?.extras.state;
    if (data) {
      this.header = data.header ?? this.header;
      this.widget = data.widget ?? this.widget;
      this.settings = data.widget?.settings ?? this.settings;
    }
    this.isAdmin =
      this.safeAuthService.userIsAdmin && environment.module === 'backoffice';
  }

  ngOnInit(): void {
    console.log(this.location.getState());
    console.log(history.state);
    this.setUpListeners();
    if (this.id) {
      this.applicationWidgetService.loadApplication(this.id);
    }
  }

  /**
   * Set up page listeners for application widget
   */
  private setUpListeners() {
    this.applicationWidgetService.application
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (application) => {
          if (application) {
            this.application = application;
            if (application.pages?.length) {
              this.updateTabs(application.pages);
              this.changeTab(
                this.tabs[this.tabs.length - 1],
                this.tabs.length - 1
              );
            } else {
              this.changeTab({ route: 'add-page' } as PageTab);
            }
          } else {
            this.applicationWidgetService.createApplication();
          }
          console.log(application);
        },
      });
  }

  /**
   * Set to view the given tab
   *
   * @param tab tab name
   * @param tabIndex tab index
   */
  changeTab(tab: PageTab, tabIndex: number = 0) {
    this.selectedTab = tabIndex;
    const route = `./${tab.route}${tab.id ? '/' + tab.id : ''}`;
    this.router.navigate([route], {
      relativeTo: this.activatedRoute,
      skipLocationChange: true,
    });
  }

  /**
   * Executes sequentially actions enabled by settings for the floating button
   *
   * @param options action options.
   */
  public async onQuickAction(options: any): Promise<void> {
    // Handle action
    if (options.selectAll) {
      console.log(options);
    }
  }

  /**
   * Handle each page type subscriptions and listeners on rendering them
   *
   * @param content Loaded page by route
   */
  getCurrentTabContent(content: any) {
    if (content instanceof AddPageComponent) {
    } else if (content instanceof FormsComponent) {
    } else if (content instanceof DashboardComponent) {
    }
    console.log(content);
  }

  /**
   * Update current widget application tabs
   *
   * @param pages page collection
   */
  private updateTabs(pages: Page[]) {
    this.tabs = [];
    pages.forEach((page) => {
      const newTab: PageTab = {
        label: page.name as string,
        route: page.type as keyof typeof ContentType as string,
        id: page.id,
      };
      this.tabs.push(newTab);
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subscriptions.unsubscribe();
  }
}
