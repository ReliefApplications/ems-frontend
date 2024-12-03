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
   * @param route Angular route service
   * @param activatedRoute Angular activated route service
   */
  constructor(
    private restService: RestService,
    private applicationService: ApplicationService,
    public route: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.route.events
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
   * @returns Observable of the tracked activity
   */
  public track(activity: any) {
    let route = this.activatedRoute;
    const componentAndParams: Record<string, any> = {};

    // Traverse the route tree to gather components and their parameters
    while (route.firstChild) {
      route = route.firstChild;

      // Get route parameters for the current component
      route.params.subscribe((params) => {
        if (route.component) {
          const componentName = route.component.name;
          if (componentName) {
            // Attach the corresponding params to the component
            componentAndParams[componentName] = {
              ...(componentAndParams[componentName] || {}),
              ...params,
            };
          }
        }
      });
    }

    if (componentAndParams.ApplicationComponent) {
      activity.applicationId = componentAndParams.ApplicationComponent.id;
      activity.metadata.applicationId =
        componentAndParams.ApplicationComponent.id;
    }

    console.log('Activity:', activity);

    return this.restService.post(this.activityBasePath, activity).subscribe(
      (response) => {
        console.log('Activity tracked successfully', response);
      },
      (error) => {
        console.error('Error tracking activity', error);
      }
    );
  }
}
