import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  SafeAuthService,
  SafeFormService,
  SafeWorkerService,
} from '@oort-front/safe';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

/**
 * Root component of back-office.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'back-office';

  /**
   * Root component of back-office
   *
   * @param authService Shared authentication service
   * @param workerService Service to handle web worker client
   * @param formService Shared form service
   * @param translate Angular translate service
   */
  constructor(
    private authService: SafeAuthService,
    private workerService: SafeWorkerService,
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

  ngOnDestroy(): void {
    this.workerService.destroyWorker();
  }
}
