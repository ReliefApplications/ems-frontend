import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { WhoAuthService } from '../../services/auth.service';
import { Account } from 'msal';
import { PermissionsManagement, PermissionType } from '../../models/user.model';
import { Application } from '../../models/application.model';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { Notification } from '../../models/notification.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationModalComponent } from './application-modal/application-modal.component';
import { WhoNotificationService } from '../../services/notification.service';


@Component({
  selector: 'who-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class WhoLayoutComponent implements OnInit, OnChanges, OnDestroy {

  // === HEADER TITLE ===
  @Input() title: string;

  @Input() navGroups: any[];

  @Input() applications: Application[];

  @Input() route: ActivatedRoute;

  @Input() toolbar: TemplateRef<any>;

  @Output() openApplication: EventEmitter<Application> = new EventEmitter();


  filteredNavGroups = [];
  public searchText = '';

  // === NOTIFICATIONS ===
  notifications: Notification[] = [];
  notificationsSubscription: Subscription;

  // === AZURE ACCOUNT ===
  account: Account;

  // === DISPLAY ===
  public largeDevice: boolean;


  constructor(
    private router: Router,
    private authService: WhoAuthService,
    public dialog: MatDialog,
    private notificationService: WhoNotificationService
  ) {
    this.largeDevice = (window.innerWidth > 1024);
    this.account = this.authService.account;
  }

  ngOnInit(): void {
    this.authService.user.subscribe(() => {
      this.filteredNavGroups = [];
      for (const group of this.navGroups) {
        const navItems = group.navItems.filter((item) => {
          const permission = PermissionsManagement.getRightFromPath(item.path, PermissionType.access);
          return this.authService.userHasClaim(permission);
        });
        if (navItems.length > 0) {
          const filteredGroup = {
            name: group.name,
            navItems
          };
          this.filteredNavGroups.push(filteredGroup);
        }
      }
    });
    this.notificationService.initNotifications();
    this.notificationsSubscription = this.notificationService.notifications.subscribe((notifications: Notification[]) => {
      if (notifications) {
        this.notifications = notifications;
      } else {
        this.notifications = [];
      }
    });
  }

  ngOnChanges(): void {
    this.authService.user.subscribe(() => {
      this.filteredNavGroups = [];
      for (const group of this.navGroups) {
        const navItems = group.navItems.filter((item) => {
          const permission = PermissionsManagement.getRightFromPath(item.path, PermissionType.access);
          return this.authService.userHasClaim(permission);
        });
        if (navItems.length > 0) {
          const filteredGroup = {
            name: group.name,
            callback: group.callback,
            navItems
          };
          this.filteredNavGroups.push(filteredGroup);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.notificationsSubscription.unsubscribe();
  }

  /*  Go back to previous view
  */
  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  /*  Change the display depending on windows size.
  */
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.largeDevice = (event.target.innerWidth > 1024);
  }

  onClick(callback: () => any, event: any): void {
    callback();
    event.preventDefault();
    event.stopPropagation();
  }

  drop(event: any, group: any): void {
    moveItemInArray(group.navItems, event.previousIndex, event.currentIndex);
    group.callback(group.navItems);
  }

  /*  Call logout method of authService.
    */
  logout(): void {
    this.authService.logout();
  }

  openApplicationModal(): void {
    this.dialog.open(ApplicationModalComponent, {
      data: this.applications
    });
  }

  onNotificationClick(notification: Notification): void {
    this.notificationService.markAsSeen(notification);
  }

  openApplicationEvent(application: Application): void {
    this.openApplication.emit(application);
  }
}

