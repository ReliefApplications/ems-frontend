import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IWidgetType } from '../../models/dashboard.model';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';

/**
 * Component for widget choice
 */
@Component({
  selector: 'safe-widget-choice',
  templateUrl: './widget-choice.component.html',
  styleUrls: ['./widget-choice.component.scss'],
})
export class SafeWidgetChoiceComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  public hovered = '';
  public collapsed = false;

  @Input() floating = false;

  @Input() widgetTypes?: IWidgetType[];

  @Output() add: EventEmitter<string> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();

  /**
   * Widget choice constructor
   *
   * @param activatedRoute ActivatedRoute
   */
  constructor(private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if (data.source === 'widget') {
          this.collapsed = true;
        }
      },
    });
  }
  /**
   * Emit an add event on selection
   *
   * @param e The event of the selection
   */
  public onSelect(e: any): void {
    this.add.emit(e);
  }
}
