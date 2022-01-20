import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SafeAuthService, SafeFormService } from '@safe/builder';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'back-office';

  private readonly destroying$ = new Subject<void>();

  constructor(
    private oauthService: OAuthService,
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
    // this.keycloakService.keycloakEvents$.subscribe({
    //   next: async (e) => {
    //     console.log('EVENT', e);
    //     if (e.type === KeycloakEventType.OnTokenExpired) {
    //       this.keycloakService.updateToken(20);
    //     }
    //     if (e.type === KeycloakEventType.OnAuthSuccess) {
    //       this.keycloakService
    //         .getToken()
    //         .then((token) => localStorage.setItem('idtoken', token));
    //       if (window.location.pathname.endsWith('/auth')) {
    //         this.router.navigate(['/']);
    //       }
    //     }
    //   },
    // });
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
