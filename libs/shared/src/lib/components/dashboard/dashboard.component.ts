import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';

@Component({
  selector: 'shared-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends UnsubscribeComponent {
  active = true;
}
