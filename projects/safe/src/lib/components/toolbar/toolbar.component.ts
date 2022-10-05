import { Component, OnInit, Input, Inject} from '@angular/core';
import { Account, SafeAuthService } from '../../services/auth/auth.service';
import { SafeNotificationService } from '../../services/notification/notification.service';
import { SafePreferencesModalComponent } from '../preferences-modal/preferences-modal.component';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Notification } from '../../models/notification.model';
import { SafeDateTranslateService } from '../../services/date-translate/date-translate.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../models/user.model';
import { SafeConfirmModalComponent } from '../confirm-modal/confirm-modal.component';


@Component({
  selector: 'safe-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class SafeToolbarComponent implements OnInit {
  /** Application environment */
  private environment: any;
    /** Application title */
  @Input() public title = '';

  // === USER INFO ===
  @Input() profileRoute = '/profile';
  public account: Account | null;
  public user?: User;

  // === DISPLAY ===
  public theme: any;
  public languages: string[] = []
  public showPreferences = false;

  // === NOTIFICATIONS ===
  public notifications: Notification[] = [];
  private notificationsSubscription?: Subscription;
  public hasMoreNotifications = false;
  private hasMoreNotificationsSubscription?: Subscription;
  public loadingNotifications = false;

  constructor(
    @Inject('environment') environment: any,
    private translate: TranslateService,
    private dateTranslate: SafeDateTranslateService,
    private authService: SafeAuthService,
    private notificationService: SafeNotificationService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.theme = environment.theme;
    this.languages = translate.getLangs();
    this.account = this.authService.account;
    this.showPreferences = environment.availableLanguages.length > 1;
    this.environment = environment;
  }

  ngOnInit(): void {
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
      this.notificationService.hasNextPage$.subscribe((res: any) => {
        this.hasMoreNotifications = res;
        this.loadingNotifications = false;
      });
  }

  ngOnDestroy(): void {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    if (this.hasMoreNotificationsSubscription) {
      this.hasMoreNotificationsSubscription.unsubscribe();
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
