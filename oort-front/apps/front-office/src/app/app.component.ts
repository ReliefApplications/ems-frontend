import { Component, OnInit } from '@angular/core';
import { SafeAuthService, SafeFormService } from '@oort-front/safe';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

/**
 * Main component of Front-office.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'front-office';

  /**
   * Main component of Front-office.
   *
   * @param authService Shared authentication service
   * @param formService Shared form service. We need to initialize the service there.
   * @param translate Angular translate service
   */
  constructor(
    private authService: SafeAuthService,
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
}
