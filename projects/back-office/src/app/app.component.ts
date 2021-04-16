import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionType } from '@azure/msal-browser';
import { SafeAuthService, SafeFormService } from '@safe/builder';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'back-office';

  // === MSAL ERROR HANDLING ===
  private subscription?: Subscription;

  constructor(
    private msalBroadcastService: MsalBroadcastService,
    private authService: SafeAuthService,
    private msalService: MsalService,
    private formService: SafeFormService
  ) { }

  ngOnInit(): void {
    this.subscription = this.msalBroadcastService.msalSubject$.pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.HANDLE_REDIRECT_START)
    )
    .subscribe(() => {
      this.authService.getProfile();
      this.authService.checkAccount();
      console.log(this.authService.account);
      if (this.authService.account) {
        const idToken: any = this.msalService.instance.getActiveAccount()?.idTokenClaims;
        const timeout = Number(idToken.exp) * 1000 - Date.now() - 1000;
        if (idToken && timeout > 0) {
          setTimeout(() => {
            this.msalService.acquireTokenSilent({
              scopes: [environment.clientId]
            });
          }, timeout);
        }
      }
    });
  }

  ngOnDestroy(): void {
    // this.msalBroadcastService.msalSubject$.pipe().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
