import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';

/**
 * Generic widget component, must be extended by other widgets.
 */
@Component({
  selector: 'shared-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class WidgetComponent extends UnsubscribeComponent {}
