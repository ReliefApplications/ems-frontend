import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  SafeAuthService,
  SafeDateTranslateService,
  SafeFormService,
} from '@safe/builder';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { DateAdapter } from '@angular/material/core';

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
    private translate: TranslateService,
    private adapter: DateAdapter<any>,
    private dateTranslate: SafeDateTranslateService
  ) {
    this.translate.addLangs(environment.availableLanguages);
    this.translate.setDefaultLang('en');
    this.dateTranslate.getCurrentLang().subscribe((lang) => {
      this.adapter.setLocale(lang);
    });
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
