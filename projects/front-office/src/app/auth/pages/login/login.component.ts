import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { KeycloakService } from 'keycloak-angular';
import { AuthenticationType } from '@safe/builder';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  /**
   * Login page.
   *
   * @param msalGuardConfig MSAL Guard configuration (injected)
   * @param msalService MSAL service
   */
  constructor(
    @Optional()
    @Inject(MSAL_GUARD_CONFIG)
    private msalGuardConfig: MsalGuardConfiguration,
    @Optional() private msalService: MsalService,
    @Optional() private keycloakService: KeycloakService
  ) {}

  /**
   * Redirects to Azure authentication page.
   */
  onLogin(): void {
    if (environment.authenticationType === AuthenticationType.azureAD) {
      if (this.msalGuardConfig.authRequest) {
        this.msalService.loginRedirect({
          ...this.msalGuardConfig.authRequest,
        } as RedirectRequest);
      } else {
        this.msalService.loginRedirect();
      }
    } else {
      this.keycloakService.login();
    }
  }
}
