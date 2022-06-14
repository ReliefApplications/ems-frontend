import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { SafeAuthService, SafeFormService } from '@safe/builder';

/**
 * Main component of Front-office.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'public-dashboards';

  /** Listens to self-destruction */
  private readonly destroying$ = new Subject<void>();

  /**
   * Main component of Front-office.
   *
   * @param formService Shared form service. We need to initialize the service there.
   * @param translate Angular translate service
   */
  constructor(
    private translate: TranslateService,
    private authService: SafeAuthService,
    private formService: SafeFormService
  ) {
    this.translate.addLangs(environment.availableLanguages);
    this.translate.setDefaultLang(environment.availableLanguages[0]);
  }

  ngOnInit(): void {
    this.authService.initLoginSequence(false);
  }

  /**
   * Confirms end of app.
   */
  ngOnDestroy(): void {
    this.destroying$.next(undefined);
    this.destroying$.complete();
  }
}
