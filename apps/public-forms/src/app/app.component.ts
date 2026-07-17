import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { HeaderService } from './services/header/header.service';

/**
 * Root component of the public-forms application.
 */
@Component({
  selector: 'oort-front-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /** Application title */
  title = 'public-forms';
  /** Theme of the environment, used to color the header */
  public theme = environment.theme;
  /** Name of the displayed form, shown in the header when a form is loaded */
  public formTitle$ = this.headerService.formTitle$;

  /**
   * Root component of the public-forms application.
   *
   * @param headerService Provides the name of the currently displayed form
   */
  constructor(private headerService: HeaderService) {}
}
