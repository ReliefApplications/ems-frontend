import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeAuthService, SafeFormService } from '@safe/builder';
import { Subject } from 'rxjs';
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
    private authService: SafeAuthService,
    // We need to initialize the service there
    private formService: SafeFormService,
    private translate: TranslateService
  ) {
    this.translate.addLangs(environment.availableLanguages);
    this.translate.setDefaultLang(environment.availableLanguages[0]);
  }

  /**
   * Configuration of the Authentication behavior
   */
  ngOnInit(): void {
    this.authService.initLoginSequence();
  }

  /**
   * Confirms end of app.
   */
  ngOnDestroy(): void {
    this.destroying$.next(undefined);
    this.destroying$.complete();
  }
}
