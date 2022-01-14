import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { SafeAuthService, SafeFormService } from '@safe/builder';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { config, AuthenticationType } from '@safe/builder';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'back-office';

  private readonly destroying$ = new Subject<void>();

  constructor(
    @Optional() private broadcastService: MsalBroadcastService,
    @Optional() private msalService: MsalService,
    @Optional() private keycloakService: KeycloakService,
    private router: Router,
    private authService: SafeAuthService,
    // We need to initialize the service there
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
    if (environment.authenticationType === AuthenticationType.azureAD) {
      this.msalService.instance.enableAccountStorageEvents();
      this.broadcastService.msalSubject$
        .pipe(
          filter(
            (msg: EventMessage) =>
              msg.eventType === EventType.ACCOUNT_ADDED ||
              msg.eventType === EventType.ACCOUNT_REMOVED
          )
        )
        .subscribe((result: EventMessage) => {
          if (this.msalService.instance.getAllAccounts().length === 0) {
            window.location.pathname = '/';
          }
        });
      this.broadcastService.inProgress$
        .pipe(
          filter(
            (status: InteractionStatus) => status === InteractionStatus.None
          ),
          takeUntil(this.destroying$)
        )
        .subscribe(() => {
          this.checkAndSetActiveAccount();
        });
      this.broadcastService.msalSubject$
        .pipe(
          filter(
            (msg: EventMessage) =>
              msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
          ),
          takeUntil(this.destroying$)
        )
        .subscribe((result: any) => {
          if (result.payload) {
            localStorage.setItem('idtoken', result.payload.accessToken);
          }
        });
      this.msalService.handleRedirectObservable().subscribe({
        next: (result: AuthenticationResult) => {
          this.checkAndSetActiveAccount();
          if (window.location.pathname.endsWith('/auth')) {
            this.router.navigate(['/']);
          }
        },
      });
    } else {
      this.keycloakService.keycloakEvents$.subscribe({
        next: async (e) => {
          console.log('EVENT', e);
          if (e.type === KeycloakEventType.OnTokenExpired) {
            this.keycloakService.updateToken(20);
          }
          if (e.type === KeycloakEventType.OnAuthSuccess) {
            this.keycloakService
              .getToken()
              .then((token) => localStorage.setItem('idtoken', token));
            if (window.location.pathname.endsWith('/auth')) {
              this.router.navigate(['/']);
            }
          }
        },
      });
    }
  }

  /**
   * Gets active account and set one as active if no current account.
   */
  private checkAndSetActiveAccount(): void {
    const activeAccount = this.msalService.instance.getActiveAccount();
    if (
      !activeAccount &&
      this.msalService.instance.getAllAccounts().length > 0
    ) {
      const accounts = this.msalService.instance.getAllAccounts();
      this.msalService.instance.setActiveAccount(accounts[0]);
      this.authService.checkAccount();
    }
  }

  /**
   * Confirms end of app.
   */
  ngOnDestroy(): void {
    this.destroying$.next(undefined);
    this.destroying$.complete();
  }
}
