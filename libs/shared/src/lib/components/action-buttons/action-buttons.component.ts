import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { ActionButton } from '../action-button/action-button.type';
import { Dashboard } from '../../models/dashboard.model';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';

/**
 * Dashboard action buttons component.
 */
@Component({
  selector: 'shared-action-buttons',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent],
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** List of action buttons */
  @Input() actionButtons: ActionButton[] = [];
  /** Dashboard */
  @Input() dashboard?: Dashboard;
  /** Reload dashboard event emitter */
  @Output() reloadDashboard = new EventEmitter<void>();
  /** Should refresh buttons, some of them ( subscribe / unsubscribe ) can depend on other buttons */
  public refresh = new Subject<void>();
  /** Context id of the current dashboard, if available */
  public contextId?: string;
  /** Activated route */
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    if (this.dashboard) {
      this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe({
        next: ({ id }) => {
          this.contextId = id;
        },
      });
    }
  }
}
