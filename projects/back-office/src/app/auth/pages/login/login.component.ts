import { Component, Inject, OnInit } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
  ) { }

  ngOnInit(): void {
  }

  /**
   * Redirects to Azure authentication page.
   */
  onLogin(): void {
    if (this.msalGuardConfig.authRequest) {
      this.msalService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }
}
