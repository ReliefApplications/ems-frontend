import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ContextService } from '../../services/context/context.service';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { Observable, takeUntil } from 'rxjs';
import { isEmpty } from 'lodash';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';

/**
 * Dashboard filter icon.
 * Appears in application header.
 */
@Component({
  selector: 'shared-dashboard-filter-icon',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    IndicatorsModule,
    TooltipModule,
  ],
  templateUrl: './dashboard-filter-icon.component.html',
  styleUrls: ['./dashboard-filter-icon.component.scss'],
})
export class DashboardFilterIconComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Is filter active ( value not empty ) */
  public active = false;
  /** Should button be enabled */
  public enabled!: Observable<boolean>;

  /**
   * Dashboard filter icon.
   * Appears in application header.
   *
   * @param contextService Shared context service
   */
  constructor(private contextService: ContextService) {
    super();
    this.enabled = this.contextService.isFilterEnabled$;
  }

  ngOnInit(): void {
    this.contextService.filter$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ current }) => {
        this.active = !isEmpty(current);
      });
  }

  /**
   * Toggle filter visibility on click.
   */
  onToggleVisibility() {
    const openedState = this.contextService.filterOpened.getValue();
    this.contextService.filterOpened.next(!openedState);
  }
}
