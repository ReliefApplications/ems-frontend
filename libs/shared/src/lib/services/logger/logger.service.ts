import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { ApplicationService } from '../application/application.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

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
   * @param applicationService Service to manage applications
   * @param router Angular router service
   * @param activatedRoute Angular activated route service
   */
  constructor(
    private restService: RestService,
    private applicationService: ApplicationService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        console.log('NavigationEnd:', event);
        if (event instanceof NavigationEnd) {
          this.track({
            eventType: 'navigation',
            metadata: {
              url: event.urlAfterRedirects,
            },
          });
        }
      });
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
      activity.applicationId = appParams.id;
      activity.metadata.applicationId = appParams.id;
    }

    console.log('Activity:', activity);

    this.restService.post(this.activityBasePath, activity).subscribe(
      (response) => {
        console.log('Activity tracked successfully', response);
      },
      (error) => {
        console.error('Error tracking activity', error);
      }
    );
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
