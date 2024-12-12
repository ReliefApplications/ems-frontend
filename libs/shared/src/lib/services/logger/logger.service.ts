import { Injectable } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { isNil } from 'lodash';
import { combineLatest, filter, pairwise, startWith } from 'rxjs';
import { ApplicationService } from '../application/application.service';
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
   * @param restService Service to make REST calls
   * @param router Angular router service
   * @param applicationService Angular application service
   */
  constructor(
    private restService: RestService,
    public router: Router,
    private applicationService: ApplicationService
  ) {
    combineLatest([
      this.router.events,
      this.applicationService.loadingApplication$.pipe(
        startWith(false),
        pairwise()
      ),
    ])
      .pipe(
        filter(([event, [prevLoadingState, nextLoadingState]]) => {
          const isEnd = event instanceof Scroll;
          return isEnd && prevLoadingState && !nextLoadingState;
        })
      )
      .subscribe(([event]) => {
        if (event instanceof Scroll) {
          const applicationId =
            this.applicationService.application.getValue()?.id;
          this.track({
            eventType: 'navigation',
            metadata: {
              ...(!isNil(applicationId) && { applicationId }),
              url: event.routerEvent.urlAfterRedirects,
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
    this.restService.post(this.activityBasePath, activity).subscribe({
      error: (err) => {
        console.error('Error while tracking activity: ', err);
      },
    });
  }
}
