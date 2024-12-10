import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.service';
import { Breadcrumb } from '@oort-front/ui';
import { isNil } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

/**
 * Service to track user activity
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  /** Base path for activity tracking */
  private activityBasePath = '/activity';

  /**
   * Service to track user activity
   *
   * @param restService Service to make REST calls
   * @param router Angular router service
   * @param activatedRoute Angular activated route service
   * @param breadcrumbService Breadcrumb service
   * @param translate Translate service
   */
  constructor(
    private restService: RestService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        switchMap((event) =>
          this.breadcrumbService.breadcrumbs$.pipe(
            map((breadcrumb) => ({
              event,
              title: this.getCurrentPageTitle(breadcrumb),
            }))
          )
        )
      )
      .subscribe(({ event, title }) => {
        if (event instanceof NavigationEnd) {
          console.log(title);
          this.track({
            eventType: 'navigation',
            metadata: {
              url: (event as any).urlAfterRedirects,
              // ...(title && { title }),
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
    breadcrumbs.forEach((bc) => {
      if (!isNil(bc.text)) {
        page = bc.text;
      }
      if (!isNil(bc.key)) {
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
