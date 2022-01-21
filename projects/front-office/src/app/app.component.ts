import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SafeAuthService, SafeFormService } from '@safe/builder';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';

/**
 * Main component of Front-office.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'front-office';

  /** Listens to self-destruction */
  private readonly destroying$ = new Subject<void>();

  /**
   * Main component of Front-office.
   *
   * @param oauthService OAuth Service
   * @param router Angular router
   * @param authService Shared authentication service
   * @param formService Shared form service. We need to initialize the service there.
   * @param translate Angular translate service
   */
  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private authService: SafeAuthService,
    private formService: SafeFormService,
    private translate: TranslateService
  ) {
    translate.addLangs(environment.availableLanguages);
    translate.setDefaultLang('en');
  }

  /**
   * Configuration of the Authentication behavior
   */
  ngOnInit(): void {
    // if (environment.authenticationType === AuthenticationType.azureAD) {
    //   this.msalService.instance.enableAccountStorageEvents();
    //   this.broadcastService.msalSubject$
    //     .pipe(
    //       filter(
    //         (msg: EventMessage) =>
    //           msg.eventType === EventType.ACCOUNT_ADDED ||
    //           msg.eventType === EventType.ACCOUNT_REMOVED
    //       )
    //     )
    //     .subscribe((result: EventMessage) => {
    //       if (this.msalService.instance.getAllAccounts().length === 0) {
    //         window.location.pathname = '/';
    //       }
    //     });
    //   this.broadcastService.inProgress$
    //     .pipe(
    //       filter(
    //         (status: InteractionStatus) => status === InteractionStatus.None
    //       ),
    //       takeUntil(this.destroying$)
    //     )
    //     .subscribe(() => {
    //       this.checkAndSetActiveAccount();
    //     });
    //   this.broadcastService.msalSubject$
    //     .pipe(
    //       filter(
    //         (msg: EventMessage) =>
    //           msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
    //       ),
    //       takeUntil(this.destroying$)
    //     )
    //     .subscribe((result: any) => {
    //       if (result.payload) {
    //         localStorage.setItem('idtoken', result.payload.accessToken);
    //       }
    //     });
    //   this.msalService.handleRedirectObservable().subscribe({
    //     next: (result: AuthenticationResult) => {
    //       this.checkAndSetActiveAccount();
    //       if (window.location.pathname.endsWith('/auth')) {
    //         this.router.navigate(['/']);
    //       }
    //     },
    //   });
    // } else {
    //   this.keycloakService.keycloakEvents$.subscribe({
    //     next: async (e) => {
    //       console.log('EVENT', e);
    //       if (e.type === KeycloakEventType.OnTokenExpired) {
    //         this.keycloakService.updateToken(20);
    //       }
    //       if (e.type === KeycloakEventType.OnAuthSuccess) {
    //         this.keycloakService
    //           .getToken()
    //           .then((token) => localStorage.setItem('idtoken', token));
    //         if (window.location.pathname.endsWith('/auth')) {
    //           this.router.navigate(['/']);
    //         }
    //       }
    //     },
    //   });
    // }
  }

  /**
   * Confirms end of app.
   */
  ngOnDestroy(): void {
    this.destroying$.next(undefined);
    this.destroying$.complete();
  }
}
