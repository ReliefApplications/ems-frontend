import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SafeApplicationWidgetService } from '../../services/application/application-widget.service';
import { Subject, Subscription, filter, takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Widget host for application type
 */
@Component({
  selector: 'safe-widget-tab-host',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './widget-tab-host.component.html',
  styleUrls: ['./widget-tab-host.component.scss'],
  providers: [SafeApplicationWidgetService],
})
export class SafeWidgetTabHostComponent implements OnInit, OnDestroy {
  @Input() widget: any;
  @Input() header = true;

  // === EMIT EVENT ===
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() triggerNavigation: EventEmitter<string> = new EventEmitter();

  private activeComponentSubscriptions = new Subscription();
  private destroy$ = new Subject<void>();

  outletName!: string;
  pathName!: string;

  @HostBinding()
  id = `widget-${uuidv4()}`;

  /**
   * Safe widget host tab constructor
   *
   * @param applicationWidgetService SafeApplicationWidgetService
   */
  constructor(private applicationWidgetService: SafeApplicationWidgetService) {}

  ngOnInit(): void {
    this.applicationWidgetService.widgetState = {
      header: this.header,
      widget: this.widget,
      settings: this.widget.settings,
    };
  }

  /**
   * Add listeners to listen for application widget changes
   */
  setApplicationWidgetListeners() {
    this.activeComponentSubscriptions.add(
      this.applicationWidgetService.applicationWidgetTile$
        .pipe(
          filter((applicationSettings: any | null) => !!applicationSettings),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (applicationSettings: any) => {
            this.edit.emit({
              id: this.widget.id,
              options: applicationSettings,
              type: 'data',
            });
          },
        })
    );
  }

  /**
   * Remove all listeners for application widget changes
   */
  removeApplicationWidgetListeners() {
    this.activeComponentSubscriptions.unsubscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.removeApplicationWidgetListeners();
  }
}
