import {
  Component,
  ComponentRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Account, SafeAuthService } from '../../services/auth/auth.service';
import { SafeLayoutService } from '../../services/layout/layout.service';
import {
  PermissionsManagement,
  PermissionType,
  User,
} from '../../models/user.model';
import { Application } from '../../models/application.model';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { Notification } from '../../models/notification.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { SafeNotificationService } from '../../services/notification/notification.service';
import { SafeConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { SafePreferencesModalComponent } from '../preferences-modal/preferences-modal.component';
import { SafeDateTranslateService } from '../../services/date-translate/date-translate.service';

/**
 * Component for the main layout of the platform
 */
@Component({
  selector: 'safe-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class SafeLayoutComponent implements OnInit, OnChanges, OnDestroy {
  // === HEADER TITLE ===
  @Input() title = '';

  @Input() navGroups: any[] = [];

  @Input() applications: Application[] = [];

  @Input() route?: ActivatedRoute;

  @Input() toolbar?: TemplateRef<any>;

  @ViewChild('rightSidenav', { read: ViewContainerRef })
  rightSidenav?: ViewContainerRef;

  @ViewChild('leftSidenav', { read: ViewContainerRef })
  leftSidenav?: MatSidenav;

  @Output() openApplication: EventEmitter<Application> = new EventEmitter();

  @Output() reorder: EventEmitter<any> = new EventEmitter();

  @Input() profileRoute = '/profile';

  @Input() showLeftSidenav = true;

  filteredNavGroups: any[] = [];

  languages: string[] = [];

  // === NOTIFICATIONS ===
  public notifications: Notification[] = [];
  private notificationsSubscription?: Subscription;
  public hasMoreNotifications = false;
  private hasMoreNotificationsSubscription?: Subscription;
  public loadingNotifications = false;

  // === USER INFO ===
  public account: Account | null;
  public user?: User;
  private userSubscription?: Subscription;

  // === DISPLAY ===
  public largeDevice: boolean;
  public theme: any;

  public showSidenav = false;
  public showPreferences = false;

  public otherOffice = '';
  private environment: any;
  private inApplication = false;

  // === APP SEARCH ===
  public showAppMenu = false;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param environment This is the environment in which we are running the application
   * @param router The Angular Router service
   * @param authService This is the service that handles authentication
   * @param notificationService This is the service that handles the notifications.
   * @param layoutService This is the service that handles the layout of the application.
   * @param dialog This is the dialog service provided by Angular Material
   * @param translate This is the Angular service that translates text
   * @param dateTranslate Service used for date formatting
   */
  constructor(
    @Inject('environment') environment: any,
    private router: Router,
    private authService: SafeAuthService,
    private notificationService: SafeNotificationService,
    private layoutService: SafeLayoutService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private dateTranslate: SafeDateTranslateService
  ) {
    this.largeDevice = window.innerWidth > 1024;
    this.account = this.authService.account;
    this.environment = environment;
    this.languages = this.translate.getLangs();
    this.getLanguage();
    this.theme = this.environment.theme;
    this.showPreferences = environment.availableLanguages.length > 1;
  }

  ngOnInit(): void {
    if (this.environment.module === 'backoffice') {
      this.inApplication = this.router.url.includes('/applications/');
      this.otherOffice = 'front office';
    } else {
      this.otherOffice = 'back office';
    }
    this.loadUserAndUpdateLayout();
    this.notificationService.init();
    this.notificationsSubscription =
      this.notificationService.notifications$.subscribe(
        (notifications: Notification[]) => {
          if (notifications) {
            this.notifications = notifications;
          } else {
            this.notifications = [];
          }
        }
      );

    this.hasMoreNotificationsSubscription =
      this.notificationService.hasNextPage$.subscribe((res) => {
        this.hasMoreNotifications = res;
        this.loadingNotifications = false;
      });

    this.layoutService.rightSidenav$.subscribe((view) => {
      if (view && this.rightSidenav) {
        // this is necessary to prevent have more than one history component at the same time.
        this.layoutService.setRightSidenav(null);
        //this.showSidenav = true;
        const componentRef: ComponentRef<any> =
          this.rightSidenav.createComponent(view.component);
        for (const [key, value] of Object.entries(view.inputs)) {
          componentRef.instance[key] = value;
        }
        componentRef.instance.cancel.subscribe(() => {
          componentRef.destroy();
          this.layoutService.setRightSidenav(null);
        });
      } else {
        //this.showSidenav = false;
        if (this.rightSidenav) {
          this.rightSidenav.clear();
        }
      }
    });
  }

  /**
   * Load the user and update availables navGroups accordingly
   */
  private loadUserAndUpdateLayout(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    this.userSubscription = this.authService.user$.subscribe((user) => {
      if (user) {
        this.user = { ...user };
      }
      this.filteredNavGroups = [];
      for (const group of this.navGroups) {
        const navItems = group.navItems.filter((item: any) => {
          if (this.inApplication) {
            return true;
          }
          const permission = PermissionsManagement.getRightFromPath(
            item.path,
            PermissionType.access
          );
          return this.authService.userHasClaim(
            permission,
            this.environment.module === 'backoffice'
          );
        });
        if (navItems.length > 0) {
          const filteredGroup = {
            name: group.name,
            callback: group.callback,
            navItems,
          };
          this.filteredNavGroups.push(filteredGroup);
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadUserAndUpdateLayout();
  }

  ngOnDestroy(): void {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.hasMoreNotificationsSubscription) {
      this.hasMoreNotificationsSubscription.unsubscribe();
    }
  }

  /**
   * Go back to previous view
   */
  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  /**
   * Change the display depending on windows size.
   *
   * @param event Event that implies a change in window size
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.largeDevice = event.target.innerWidth > 1024;
  }

  /**
   * Emit the application to open
   *
   * @param application The application that needs to be opened
   */
  onOpenApplication(application: Application): void {
    this.openApplication.emit(application);
  }

  /**
   * Handles the click event
   *
   * @param callback Callback that defines the action to perform on click
   * @param event Event that happends with the click
   */
  onClick(callback: () => any, event: any): void {
    callback();
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Drop event handler. Move item in layout navigation item list.
   *
   * @param event drop event
   * @param group group where the event occurs
   */
  drop(event: any, group: any): void {
    moveItemInArray(group.navItems, event.previousIndex, event.currentIndex);
    this.reorder.emit(group.navItems);
  }

  /**
   * Call logout method of authService.
   */
  logout(): void {
    if (!this.authService.canLogout.value) {
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
          title: this.translate.instant('components.logout.title'),
          content: this.translate.instant(
            'components.logout.confirmationMessage'
          ),
          confirmText: this.translate.instant(
            'components.confirmModal.confirm'
          ),
          confirmColor: 'primary',
        },
      });
      dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          this.authService.canLogout.next(true);
          localStorage.clear();
          this.authService.logout();
        }
      });
    } else {
      this.authService.logout();
    }
  }

  /**
   * Shows options when opening user profile
   */
  onOpenProfile(): void {
    this.router.navigate([this.profileRoute]);
  }

  /**
   * Opens the preferences modal and deals with the resulting form
   */
  onOpenPreferences(): void {
    const dialogRef = this.dialog.open(SafePreferencesModalComponent, {
      data: {
        languages: this.languages,
      },
    });
    dialogRef.afterClosed().subscribe((form) => {
      if (form && form.touched) {
        this.setLanguage(form.value.language);
        this.dateTranslate.use(form.value.dateFormat);
      } else if (!form) {
        this.setLanguage(this.getLanguage());
      }
    });
  }

  /**
   * Switches to back or front-office
   */
  onSwitchOffice(): void {
    const frontOfficeUri =
      this.environment.frontOfficeUri.slice(-1) === '/'
        ? this.environment.frontOfficeUri
        : this.environment.frontOfficeUri + '/';
    const backOfficeUri =
      this.environment.backOfficeUri.slice(-1) === '/'
        ? this.environment.backOfficeUri
        : this.environment.backOfficeUri + '/';

    if (this.environment.module === 'backoffice') {
      const location = backOfficeUri + 'applications/';
      if (window.location.href.indexOf(location) === 0) {
        window.location.href =
          frontOfficeUri +
          window.location.href.slice(
            location.length,
            window.location.href.length
          );
      } else {
        window.location.href = frontOfficeUri;
      }
    } else {
      if (window.location.href.indexOf('profile') > 0) {
        window.location.href = backOfficeUri + 'profile/';
      } else {
        window.location.href =
          backOfficeUri +
          'applications/' +
          window.location.href.slice(
            frontOfficeUri.length,
            window.location.href.length
          );
      }
    }
  }

  /**
   * Load more notifications
   *
   * @param e Event
   */
  public onLoadMoreNotifications(e: any): void {
    e.stopPropagation();
    this.notificationService.fetchMore();
    this.loadingNotifications = true;
  }

  /**
   * Marks all the notifications as read
   */
  onMarkAllNotificationsAsRead(): void {
    this.notificationService.markAllAsSeen();
  }

  /**
   * Marks notification as seen when clicking on it
   *
   * @param notification The notification that was clicked on
   */
  onNotificationClick(notification: Notification): void {
    this.notificationService.markAsSeen(notification);
  }

  /**
   * Changes current active language.
   *
   * @param language id of the language.
   */
  setLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('lang', language);
  }

  /**
   * Get the current active language. First it checks if there is one already
   * set, else it takes the default one.
   *
   * @returns language id of the language
   */
  getLanguage(): string {
    // select the langage saved (or default if not)
    let language = localStorage.getItem('lang');
    if (!language || !this.languages.includes(language)) {
      language = this.translate.defaultLang;
    }
    // if not default language, change langage of the interface
    if (language !== this.translate.defaultLang) {
      this.translate.use(language);
    }
    return language;
  }
}
