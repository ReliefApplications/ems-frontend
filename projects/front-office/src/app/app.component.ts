import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { TranslateService } from '@ngx-translate/core';
import { SafeAuthService, SafeFormService } from '@safe/builder';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from '../environments/environment';

/**
 * Main component of Front-office.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  /** Listens to self-destruction */
  private readonly destroying$ = new Subject<void>();

  /**
   * Main component of Front-office.
   *
   * @param broadcastService MSAL broadcast service
   * @param msalService MSAL service
   * @param router Angular router
   * @param authService Shared authentication service
   * @param formService Shared form service. We need to initialize the service there.
   * @param translate Angular translate service
   */
  constructor(
    private broadcastService: MsalBroadcastService,
    private msalService: MsalService,
    private router: Router,
    private authService: SafeAuthService,
    private formService: SafeFormService,
    private translate: TranslateService
  ) {
    translate.addLangs(environment.availableLanguages);
    translate.setDefaultLang('en');
  }

  /**
   * Configuration of the MSAL behavior.
   */
  ngOnInit(): void {
    this.msalService.instance.enableAccountStorageEvents();
    this.broadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
      )
      .subscribe((result: EventMessage) => {
        if (this.msalService.instance.getAllAccounts().length === 0) {
          window.location.pathname = '/';
        }
      });

    this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroying$)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });
    this.broadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS),
        takeUntil(this.destroying$)
      ).subscribe((result: any) => {
        if (result.payload) {
          localStorage.setItem('msal.idtoken', result.payload.accessToken);
        }
      });
    this.msalService.handleRedirectObservable().subscribe({
      next: (result: AuthenticationResult) => {
        this.checkAndSetActiveAccount();
        if (window.location.pathname.endsWith('/auth')) {
          this.router.navigate(['/']);
        }
      }
    });
  }

  /**
   * Confirms end of app.
   */
   ngOnDestroy(): void {
    this.destroying$.next(undefined);
    this.destroying$.complete();
  }

  /**
   * Gets active account and set one as active if no current account.
   */
  private checkAndSetActiveAccount(): void {
    const activeAccount = this.msalService.instance.getActiveAccount();
    if (!activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
      const accounts = this.msalService.instance.getAllAccounts();
      this.msalService.instance.setActiveAccount(accounts[0]);
      this.authService.checkAccount();
    }
  }
}
