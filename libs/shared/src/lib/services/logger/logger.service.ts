import { Inject, Injectable } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Breadcrumb } from '@oort-front/ui';
import { isEqual, isNil } from 'lodash';
import { combineLatest, filter, map, pairwise, startWith } from 'rxjs';
import { ApplicationService } from '../application/application.service';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.service';
import { RestService } from '../rest/rest.service';

/**
 * Service to track user activity
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  /** Base path for activity tracking */
  private activityBasePath = '/activities';

  /**
   * Service to track user activity
   *
   * @param environment Current environment
   * @param restService Service to make REST calls
   * @param router Angular router service
   * @param applicationService Application service
   * @param breadcrumbService Breadcrumb service
   * @param translate Translate service
   */
  constructor(
    @Inject('environment') private environment: any,
    private restService: RestService,
    public router: Router,
    private applicationService: ApplicationService,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService
  ) {
    combineLatest([
      this.router.events,
      this.breadcrumbService.breadcrumbs$.pipe(
        startWith(null),
        pairwise(),
        filter(([prev, next]) => {
          return !isEqual(prev, next);
        }),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        map(([_, next]) => this.getCurrentPageTitle(next as any))
      ),
      this.applicationService.loadingApplication$.pipe(
        startWith(false),
        pairwise()
      ),
    ])
      .pipe(
        filter(([event, title, [prevLoadingState, nextLoadingState]]) => {
          const isEnd = event instanceof Scroll;
          return (
            isEnd &&
            !!title &&
            /**
             * If application loading state goes
             * - from true to false => then launch event,
             * - or if there is no change in the loading state, from false to false
             * meaning no application load is happening => rest of application pages => then launch event
             */
            ((prevLoadingState && !nextLoadingState) ||
              (!prevLoadingState && !nextLoadingState))
          );
        })
      )
      .subscribe(([event, title]) => {
        if (event instanceof Scroll) {
          event = event instanceof Scroll ? event.routerEvent : event;
          const application = this.applicationService.application.getValue();
          this.track({
            eventType: 'navigation',
            metadata: {
              url: (event as any).urlAfterRedirects,
              ...(!isNil(application?.id) && {
                applicationId: application?.id,
              }),
              ...(!isNil(application?.name) && {
                applicationName: application?.name,
              }),
              title,
              module: this.environment.module,
            },
          });
        }
      });
  }

  /**
   * Get current page or navbar section name for the activity track
   *
   * @param breadcrumbs Breadcrumbs for the current route
   * @returns Current page name or navbar section title
   */
  private getCurrentPageTitle(breadcrumbs: Breadcrumb[]) {
    let page = '';
    let navSection = '';
    const hasAlias = breadcrumbs.find((bc) => 'alias' in bc);
    breadcrumbs?.forEach((bc) => {
      if (!isNil(bc.text)) {
        page = bc.text;
      }
      // If no alias present(custom page, e.g. User1), get the current nav section, e.g. Users
      if (!isNil(bc.key) && !hasAlias) {
        navSection = this.translate.instant(bc.key);
      }
    });
    return page || navSection;
  }

  /**
   * Track an activity
   *
   * @param activity Activity to track
   */
  public track(activity: any) {
    this.restService.post(this.activityBasePath, activity).subscribe({
      error: (err) => {
        console.error('Error while tracking activity: ', err);
      },
    });
  }
}
