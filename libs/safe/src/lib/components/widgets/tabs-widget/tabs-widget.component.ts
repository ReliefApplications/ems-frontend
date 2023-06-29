import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeAuthService } from '../../../services/auth/auth.service';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';

import { Location } from '@angular/common';

/**
 * Tabs widget component
 */
@Component({
  selector: 'safe-tabs-widget',
  templateUrl: './tabs-widget.component.html',
  styleUrls: ['./tabs-widget.component.scss'],
})
export class SafeTabsWidgetComponent
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

  // === PERMISSIONS ===
  public canCreateRecords = false;
  // === VERIFICATION IF USER IS ADMIN ===
  public isAdmin!: boolean;

  // === SETTINGS ===
  header = true;
  settings: any = null;
  id = '';
  canUpdate = false;
  public tabs: { label: string; route: string }[] = [];
  selectedTab = 0;
  public status: {
    message?: string;
    error: boolean;
  } = { error: false };

  // === EMIT EVENT ===
  edit: EventEmitter<any> = new EventEmitter();

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
   * @param location Location
   */
  constructor(
    @Inject('environment') environment: any,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private safeAuthService: SafeAuthService,
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
    if (this.tabs.length) {
      this.changeTab(this.tabs[0].route);
    } else {
      this.changeTab('add-page');
    }
  }
  /**
   * Set to view the given tab
   *
   * @param tab tab name
   * @param tabIndex tab index
   */
  changeTab(tab: string, tabIndex: number = 0) {
    this.selectedTab = tabIndex;
    this.router.navigate([`./${tab}`], {
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
}
