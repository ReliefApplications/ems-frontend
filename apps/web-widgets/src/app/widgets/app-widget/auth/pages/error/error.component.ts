import { Component, Inject } from '@angular/core';

/**
 * Error component.
 * Used to display authentication issue or access issue.
 */
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  /** Auth error */
  public authError!: { title: string; footer?: string };

  /**
   * Error component.
   * Used to display authentication issue or access issue.
   *
   * @param environment injected environment
   */
  constructor(@Inject('environment') environment: any) {
    this.authError = environment.messages.unauthorized;
  }
}
