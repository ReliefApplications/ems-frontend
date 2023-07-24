import { Component, OnInit } from '@angular/core';
import { SafeAuthService, SafeFormService } from '@oort-front/safe';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { AppWorker } from './app.worker';
import { WorkerManager, WorkerClient } from 'angular-web-worker/angular';

/**
 * Root component of back-office.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'back-office';
  private client!: WorkerClient<AppWorker>;

  /**
   * Root component of back-office
   *
   * @param authService Shared authentication service
   * @param formService Shared form service
   * @param translate Angular translate service
   */
  constructor(
    private workerManager: WorkerManager,
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
    if (this.workerManager.isBrowserCompatible) {
      this.client = this.workerManager.createClient(AppWorker);
    } else {
      // if code won't block UI else implement other fallback behaviour
      this.client = this.workerManager.createClient(AppWorker, true);
    }

    this.client.connect().then(() => {
      console.log('Web worker connected');
      this.client.call((w) => w.doSomeWork());
    });
    // if (typeof Worker !== 'undefined') {
    //   // Create a new
    //   const worker = new Worker(new URL('./app.worker', import.meta.url));
    //   worker.onmessage = ({ data }) => {
    //     console.log(`page got message: ${data}`);
    //   };
    //   worker.postMessage('hello');
    // } else {
    //   // Web Workers are not supported in this environment.
    //   // You should add a fallback so that your program still executes correctly.
    // }
  }
}
