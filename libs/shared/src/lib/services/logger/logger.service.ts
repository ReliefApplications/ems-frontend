import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Breadcrumb } from '@oort-front/ui';
import { isEqual, isNil } from 'lodash';
import { combineLatest, filter, map, pairwise, startWith } from 'rxjs';
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
   * @param activatedRoute Angular activated route service
   * @param breadcrumbService Breadcrumb service
   * @param translate Translate service
   */
  constructor(
    @Inject('environment') private environment: any,
    private restService: RestService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
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
    ])
      .pipe(
        filter(([event, title]) => {
          const isEnd = event instanceof Scroll;
          return isEnd && !!title;
        })
      )
      .subscribe(([event, title]) => {
        if (event instanceof Scroll) {
          event = event instanceof Scroll ? event.routerEvent : event;
          this.track({
            eventType: 'navigation',
            metadata: {
              url: (event as any).urlAfterRedirects,
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
    const componentAndParams = this.getComponentAndParams(
      this.activatedRoute.root
    );

    if (componentAndParams['ApplicationComponent']) {
      const appParams = componentAndParams['ApplicationComponent'];
      activity.metadata.applicationId = appParams.id;
    }

    this.restService.post(this.activityBasePath, activity).subscribe({
      error: (err) => {
        console.error('Error while tracking activity: ', err);
      },
    });
  }

  /**
   * Recursively traverse the route tree to gather components and their parameters
   *
   * @param route The current activated route
   * @param componentAndParams Accumulator for components and their parameters
   * @returns An object mapping component names to their parameters
   */
  private getComponentAndParams(
    route: ActivatedRoute,
    componentAndParams: Record<string, any> = {}
  ): Record<string, any> {
    if (route.component) {
      const componentName = (route.component as any).name;
      if (componentName) {
        componentAndParams[componentName] = {
          ...(componentAndParams[componentName] || {}),
          ...route.snapshot.params,
        };
      }
    }

    route.children.forEach((childRoute) => {
      this.getComponentAndParams(childRoute, componentAndParams);
    });

    return componentAndParams;
  }
}
