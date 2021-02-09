import { Component, OnDestroy, OnInit } from '@angular/core';
import { BroadcastService } from '@azure/msal-angular';
import { WhoAuthService } from '@who-ems/builder';
import { Subscription } from 'rxjs';
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
    private authService: WhoAuthService
  ) { }

  ngOnInit(): void {
    this.subscription = this.broadcastService.subscribe('msal:acquireTokenSuccess', () => {
      this.authService.getProfile();
    });
  }

  ngOnDestroy(): void {
    this.broadcastService.getMSALSubject().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
