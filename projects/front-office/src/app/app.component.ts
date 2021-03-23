import { Component, OnDestroy, OnInit } from '@angular/core';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { WhoAuthService } from '@who-ems/builder';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'front-office';

  // === MSAL ERROR HANDLING ===
  private subscription: Subscription;

  constructor(
    private broadcastService: BroadcastService,
    private authService: WhoAuthService,
    private msalService: MsalService
  ) { }

  ngOnInit(): void {
    this.subscription = this.broadcastService.subscribe('msal:acquireTokenSuccess', () => {
      this.authService.getProfile();
      this.authService.checkAccount();
      const idToken = this.authService.account.idToken;
      const timeout = Number(idToken.exp) * 1000 - Date.now() - 1000;
      setTimeout(() => {
        this.msalService.acquireTokenSilent({
          scopes: [environment.clientId]
        });
      }, timeout);
    });
  }

  ngOnDestroy(): void {
    this.broadcastService.getMSALSubject().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
