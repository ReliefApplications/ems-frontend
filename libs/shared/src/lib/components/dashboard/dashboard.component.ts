import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';

/**
 * Shared dashboard component.
 * Contains logic to indicate if active / inactive, so widgets & other elements subject to filtering can freeze, waiting for the dashboard to be rendered again.
 */
@Component({
  selector: 'shared-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends UnsubscribeComponent {
  /** Is dashboard active ( rendered ) */
  active = true;
}
