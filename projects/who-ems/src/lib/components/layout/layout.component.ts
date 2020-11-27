import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { WhoAuthService } from '../../services/auth.service';
import { Account } from 'msal';
import { PermissionsManagement, PermissionType } from '../../models/user.model';
import { Application } from '../../models/application.model';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Apollo } from 'apollo-angular';
import { GetNotificationsQueryResponse, GET_NOTIFICATIONS } from '../../graphql/queries';
import { Notification } from '../../models/notification.model';
import { Subscription } from 'rxjs';
import { NotificationSubscriptionResponse, NOTIFICATION_SUBSCRIPTION } from '../../graphql/subscriptions';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationModalComponent } from './application-modal/application-modal.component';

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

  @Input() toolbar: TemplateRef<any>;

  @Output() openApplication: EventEmitter<Application> = new EventEmitter();

  filteredNavGroups = [];

  // === NOTIFICATIONS ===
  notifications: Notification[] = [];
  notificationsSubscription: Subscription;

  // === AZURE ACCOUNT ===
  account: Account;

  // === DISPLAY ===
  public largeDevice: boolean;

  constructor(
    private authService: WhoAuthService,
    private apollo: Apollo,
    public dialog: MatDialog
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
    const notificationsQuery = this.apollo.watchQuery<GetNotificationsQueryResponse>({
      query: GET_NOTIFICATIONS
    });
    this.notificationsSubscription = notificationsQuery.valueChanges.subscribe((res) => {
      this.notifications = res.data.notifications;
    });
    // notificationsQuery.subscribeToMore<NotificationSubscriptionResponse>({
    //   document: NOTIFICATION_SUBSCRIPTION,
    //   updateQuery: (prev, { subscriptionData }) => {
    //     if (!subscriptionData.data) {
    //       return prev;
    //     }
    //     const newNotification = subscriptionData.data.notification;
    //     return {
    //       ...prev,
    //       notifications: [newNotification, ...prev.notifications]
    //     };
    //   }
    // });
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

  /*  Change the display depending on windows size.
  */
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.largeDevice = (event.target.innerWidth > 1024);
  }

  /* Emit the application to open
  */
  onOpenApplication(application: Application): void {
    this.openApplication.emit(application);
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

}
