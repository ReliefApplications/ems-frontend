import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ContextService } from '../../services/context/context.service';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { debounceTime, takeUntil } from 'rxjs';
import { isEmpty } from 'lodash';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';

/**
 * Dashboard filter icon.
 * Appears in application header.
 */
@Component({
  selector: 'shared-dashboard-filter-icon',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonModule, IndicatorsModule],
  templateUrl: './dashboard-filter-icon.component.html',
  styleUrls: ['./dashboard-filter-icon.component.scss'],
})
export class DashboardFilterIconComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Is filter active ( value not empty ) */
  public active = false;

  /**
   * Dashboard filter icon.
   * Appears in application header.
   *
   * @param contextService Shared context service
   */
  constructor(private contextService: ContextService) {
    super();
  }

  ngOnInit(): void {
    this.contextService.filter$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.active = !isEmpty(value);
      });
  }
}
