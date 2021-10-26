import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { SafeAuthService, SafeFormService } from '@safe/builder';
import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'back-office';
  isIframe = false;
  loginDisplay = false;

  // === MSAL ERROR HANDLING ===
  private subscription?: Subscription;
  private timeout?: NodeJS.Timeout;

  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private broadcastService: MsalBroadcastService,
    private authService: SafeAuthService,
    private msalService: MsalService,
    private formService: SafeFormService
  ) { }

  // ngOnInit(): void {
  //   this.subscription = this.broadcastService.msalSubject$.pipe(
  //     filter((msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS),
  //   ).subscribe((result: EventMessage) => {
  //     console.log(result);
  //     this.authService.getProfileIfNull();
  //     this.authService.getAccountIfNull();
  //     if (this.authService.account) {
  //       const idToken = this.authService.account.id;
  //       const timeout = Number(idToken.exp) * 1000 - Date.now() - 1000;
  //       if (idToken && timeout > 0) {
  //         this.timeout = setTimeout(() => {
  //           this.msalService.acquireTokenSilent({
  //             scopes: [environment.clientId]
  //           });
  //         }, timeout);
  //       }
  //     }
  //   });
  // }

  // ngOnDestroy(): void {
  //   console.log('on destroy');
  //   // this.broadcastService.getmsalSubject.next(1);
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
  // }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal
    this.setLoginDisplay();

    this.msalService.instance.enableAccountStorageEvents();
    this.broadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
      )
      .subscribe((result: EventMessage) => {
        if (this.msalService.instance.getAllAccounts().length === 0) {
          window.location.pathname = '/';
        } else {
          this.setLoginDisplay();
        }
      });

    this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      });
    this.broadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS),
        takeUntil(this._destroying$)
      ).subscribe((result: EventMessage) => console.log(result));
    this.msalService.instance.acquireTokenSilent({
      scopes: [environment.clientId]
    }).then((res) => console.log(res));
  }

  private setLoginDisplay(): void {
    this.loginDisplay = this.msalService.instance.getAllAccounts().length > 0;
  }

  private checkAndSetActiveAccount(): void {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    const activeAccount = this.msalService.instance.getActiveAccount();
    if (!activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
      const accounts = this.msalService.instance.getAllAccounts();
      this.msalService.instance.setActiveAccount(accounts[0]);
    }
  }

  loginRedirect(): void {
    if (this.msalGuardConfig.authRequest) {
      this.msalService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }

  loginPopup(): void {
    if (this.msalGuardConfig.authRequest) {
      this.msalService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.msalService.instance.setActiveAccount(response.account);
        });
    } else {
      this.msalService.loginPopup()
        .subscribe((response: AuthenticationResult) => {
          this.msalService.instance.setActiveAccount(response.account);
        });
    }
  }

  logout(popup?: boolean): void {
    if (popup) {
      this.msalService.logoutPopup({
        mainWindowRedirectUri: '/'
      });
    } else {
      this.msalService.logoutRedirect();
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
