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
  public authError!: { title: string; footer?: string };

  constructor(@Inject('environment') environment: any) {
    this.authError = environment.messages.unauthorized;
  }
}
