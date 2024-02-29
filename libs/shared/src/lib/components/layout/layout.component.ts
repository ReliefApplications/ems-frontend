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
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Account, AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';
import { Application } from '../../models/application.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Notification } from '../../models/notification.model';
import { Dialog } from '@angular/cdk/dialog';
import { NotificationService } from '../../services/notification/notification.service';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { TranslateService } from '@ngx-translate/core';
import { DateTranslateService } from '../../services/date-translate/date-translate.service';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { Breadcrumb, UILayoutService } from '@oort-front/ui';
import { BreadcrumbService } from '../../services/breadcrumb/breadcrumb.service';
import { ContextService } from '../../services/context/context.service';
import { isEqual } from 'lodash';
import { Model } from 'survey-core';

/**
 * Component for the main layout of the platform
 */
@Component({
  selector: 'shared-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges, OnDestroy
{
  /** Page title ( name of application ) */
  @Input() title = '';

  /**
   * List of applications
   */
  @Input() applications: Application[] = [];

  /**
   * Current application
   */
  @Input() route?: ActivatedRoute;

  /**
   * Header template
   */
  @Input() header?: TemplateRef<any>;
  /** Should show header */
  @Input() showHeader = true;

  /**
   * Left sidenav template
   */
  @Input() leftSidenav?: TemplateRef<any>;

  /**
   * Right sidenav template
   */
  @ViewChild('rightSidenav', { read: ViewContainerRef })
  rightSidenav?: ViewContainerRef;

  /**
   * Content template
   */
  @ViewChild('nav')
  nav?: any;
  /**
   * Content template
   */
  @Output() openApplication: EventEmitter<Application> = new EventEmitter();
  /**
   * Event emitted when the user reorders the applications
   */
  @Output() reorder: EventEmitter<any> = new EventEmitter();
  /**
   * Event emitted when the user clicks on the profile button
   */
  @Input() profileRoute = '/profile';
  /**
   * Event emitted when the user clicks on the profile button
   */
  @Input() sideMenu = true;

  /**
   * Event emitted when the user clicks on the profile button
   */
  @Input() menuOpened = true;

  /**
   * Languages available
   */
  languages: string[] = [];

  // === NOTIFICATIONS ===
  /**
   * Notifications
   */
  public notifications: Notification[] = [];
  /**
   * Boolean to check if there are more notifications
   */
  public hasMoreNotifications = false;
  /**
   * Boolean to check if notifications are loading
   */
  public loadingNotifications = false;

  /** Account information of logged user */
  public account: Account | null;
  /** Currently logged user */
  public user?: User;

  /** Is screen large */
  public largeDevice: boolean;
  /** Theme */
  public theme: any;

  /** Show sidenav */
  public showSidenav = false;
  /** Show preferences */
  public showPreferences = false;

  /** Other office */
  public otherOffice = '';
  /** Environment */
  public environment: any;
  /** Is in application */
  private inApplication = false;

  // === APP SEARCH ===
  /** Show app search */
  public showAppMenu = false;

  // === BREADCRUMB ===
  /** Breadcrumbs */
  public breadcrumbs: Breadcrumb[] = [];

  /** Timeout listeners */
  private attachViewFilterTriggerListener!: NodeJS.Timeout;
  /** Survey shared questions names on web component to track shared values when switching views */
  private surveySharedQuestions!: string[];

  /**
   * Gets URI of the other office
   *
   * @returns URI of the other office
   */
  get otherOfficeUri(): string {
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
        return (
          frontOfficeUri +
          window.location.href.slice(
            location.length,
            window.location.href.length
          )
        );
      } else {
        return frontOfficeUri;
      }
    } else {
      if (window.location.href.indexOf('profile') > 0) {
        return backOfficeUri + 'profile/';
      } else {
        return (
          backOfficeUri +
          'applications/' +
          window.location.href.slice(
            frontOfficeUri.length,
            window.location.href.length
          )
        );
      }
    }
  }

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param environment This is the environment in which we are running the application
   * @param router The Angular Router service
   * @param authService This is the service that handles authentication
   * @param notificationService This is the service that handles the notifications.
   * @param layoutService UI layout service
   * @param confirmService This is the service that is used to display a confirm window.
   * @param dialog This is the dialog service provided by Angular CDK
   * @param translate This is the Angular service that translates text
   * @param dateTranslate Service used for date formatting
   * @param breadcrumbService Shared breadcrumb service
   * @param contextService Shared breadcrumb service
   */
  constructor(
    @Inject('environment') environment: any,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private layoutService: UILayoutService,
    private confirmService: ConfirmService,
    public dialog: Dialog,
    private translate: TranslateService,
    private dateTranslate: DateTranslateService,
    private breadcrumbService: BreadcrumbService,
    private contextService: ContextService
  ) {
    super();
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
    this.loadUser();
    this.notificationService.init();
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications: Notification[]) => {
        if (notifications) {
          this.notifications = notifications;
        } else {
          this.notifications = [];
        }
      });

    this.notificationService.hasNextPage$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.hasMoreNotifications = res;
        this.loadingNotifications = false;
      });

    this.layoutService.rightSidenav$
      .pipe(takeUntil(this.destroy$))
      .subscribe((view) => {
        if (view && this.rightSidenav) {
          // avoid to have multiple right sidenav components at same time
          this.layoutService.setRightSidenav(null);
          this.showSidenav = true;
          const componentRef: ComponentRef<any> =
            this.rightSidenav.createComponent(view.component);
          if (view.inputs) {
            for (const [key, value] of Object.entries(view.inputs)) {
              componentRef.instance[key] = value;
            }
          }
          componentRef.instance.cancel.subscribe(() => {
            componentRef.destroy();
            this.layoutService.setRightSidenav(null);
          });
        } else {
          this.showSidenav = false;
          if (this.rightSidenav) {
            this.rightSidenav.clear();
          }
        }
      });

    this.breadcrumbService.breadcrumbs$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.breadcrumbs = res;
      });
  }

  /**
   * Load the user
   */
  private loadUser(): void {
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.user = { ...user };
      }
    });
  }

  ngOnChanges(): void {
    this.loadUser();
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
   * Call logout method of authService.
   */
  logout(): void {
    if (!this.authService.canLogout.value) {
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('components.logout.title'),
        content: this.translate.instant(
          'components.logout.confirmationMessage'
        ),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmVariant: 'primary',
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
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
   * Opens the preferences modal and deals with the resulting form
   */
  async onOpenPreferences(): Promise<void> {
    const { PreferencesModalComponent } = await import(
      '../preferences-modal/preferences-modal.component'
    );
    const dialogRef = this.dialog.open(PreferencesModalComponent, {
      data: {
        languages: this.languages,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((form: any) => {
      if (form && form.touched) {
        this.setLanguage(form.value.language);
        this.dateTranslate.use(form.value.dateFormat);
      } else if (!form) {
        this.setLanguage(this.getLanguage());
      }
    });
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
    // select the language saved (or default if not)
    let language = localStorage.getItem('lang');
    if (!language || !this.languages.includes(language)) {
      language = this.translate.defaultLang;
    }
    // if not default language, change language of the interface
    if (language !== this.translate.defaultLang) {
      this.translate.use(language);
    }
    return language;
  }

  /**
   * Merge context service filter shared values across all survey filter with the actual filter survey questions containing any value
   *
   * @param survey Current active filter survey in the SUI
   * @returns object with merged values from
   */
  private getViewFilterValue(survey: Model): { [key: string]: any } {
    const newFilterValues: { [key: string]: any } = {
      ...this.contextService.filter.value,
    };
    const filterKeys = Object.keys(this.contextService.filter.value);
    const currentSurveyQuestions = survey.getAllQuestions();
    // Include by default all the filter values that are present as questions in the current activated survey
    // But context filter values have priority over any value in the survey(shared question value changed from other dashboard)
    filterKeys
      .filter((fk) => currentSurveyQuestions.find((sq) => sq.name === fk))
      .forEach((filterKey) => {
        newFilterValues[filterKey] =
          this.contextService.filter.value[filterKey];
      });
    // Include all the survey question values that are not shared, not present in the current context filter value and contains a value to be set
    currentSurveyQuestions.forEach((qu: any) => {
      if (
        !this.surveySharedQuestions.includes(qu.name) &&
        !filterKeys.includes(qu.name) &&
        ((!Array.isArray(qu.value) && qu.value) ||
          (Array.isArray(qu.value) && qu.value.length))
      ) {
        // Values as array contains properties from survey question that if not casted to array spread, will make the tagbox or any question using array values to not trigger the survey value change
        newFilterValues[qu.name] = Array.isArray(qu.value)
          ? [...qu.value]
          : qu.value;
      }
    });
    return newFilterValues;
  }

  /**
   * On attach component ( only used in web elements, with reuse strategy )
   *
   * @param e Event thrown in the attach event of the router outlet containing the lastStateOfContextFilters when it was detached
   */
  onAttach(e: any) {
    if (this.contextService.shadowDomService.isShadowRoot) {
      const newFilterValues: { [key: string]: any } = this.getViewFilterValue(
        e.linkedSurvey
      );
      // If attached view context filter state and current context filter state are different we set the force trigger refresh to true and trigger the filter event again
      if (!isEqual(e.lastStateOfContextFilters, newFilterValues)) {
        if (this.attachViewFilterTriggerListener) {
          clearTimeout(this.attachViewFilterTriggerListener);
        }
        this.attachViewFilterTriggerListener = setTimeout(() => {
          this.contextService.filter.next(e.lastStateOfContextFilters);
          this.contextService.filter.next(newFilterValues);
        }, 0);
      }
    }
    if (e.onAttach) {
      e.onAttach();
    }
  }

  /**
   * On attach component ( only used in web elements, with reuse strategy )
   *
   * @param e Event thrown in the detach event of the router outlet where we set lastStateOfContextFilters value for next attach to update context filter trigger
   */
  onDetach(e: any) {
    if (this.contextService.shadowDomService.isShadowRoot) {
      // If no linked survey to the view is set, it means it's first view load
      if (!e.linkedSurvey) {
        e.linkedSurvey =
          this.contextService.webComponentsFilterSurvey[
            this.contextService.webComponentsFilterSurvey.length - 1
          ];
        // Any time a new view is set, we update the surveySharedQuestions value with the questions from the new survey
        const surveyQuestions: string[] = [];
        this.contextService.webComponentsFilterSurvey.forEach((survey) => {
          const otherSurveys =
            this.contextService.webComponentsFilterSurvey.filter(
              (sur) => !isEqual(sur, survey)
            );
          survey
            .getAllQuestions()
            // Get all questions from the survey to check that their question is not already set in the shared questions property
            .filter((qu) => !surveyQuestions.includes(qu.name))
            .forEach((qu) => {
              let isFoundQuestion = false;
              otherSurveys.forEach((sur) => {
                if (
                  sur
                    .getAllQuestions()
                    .find((question) => question.name === qu.name)
                ) {
                  isFoundQuestion = true;
                  return;
                }
              });
              if (isFoundQuestion) {
                surveyQuestions.push(qu.name);
              }
            });
        });
        this.surveySharedQuestions = Array.from(new Set(surveyQuestions));
      }
      const newFilterValues: { [key: string]: any } = this.getViewFilterValue(
        e.linkedSurvey
      );
      e.currentStateOfContextFilters = newFilterValues;
      e.lastStateOfContextFilters = e.currentStateOfContextFilters;
    }
    if (e.onDetach) {
      e.onDetach();
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.attachViewFilterTriggerListener) {
      clearTimeout(this.attachViewFilterTriggerListener);
    }
  }
}
