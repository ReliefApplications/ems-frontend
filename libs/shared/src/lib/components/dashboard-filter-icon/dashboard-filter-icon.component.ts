import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ContextService } from '../../services/context/context.service';
import { Observable, debounceTime, filter } from 'rxjs';
import { isEmpty } from 'lodash';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class DashboardFilterIconComponent implements OnInit {
  /** Is filter active ( value not empty ) */
  public active = false;
  /** Should button be enabled */
  public enabled!: Observable<boolean>;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Dashboard filter icon.
   * Appears in application header.
   *
   * @param contextService Shared context service
   * @param {ElementRef} el Current components element ref in the DOM
   */
  constructor(private contextService: ContextService, private el: ElementRef) {
    this.enabled = this.contextService.isFilterEnabled$;
  }

  ngOnInit(): void {
    this.contextService.filter$
      .pipe(
        // On working with web components we want to send filter value if this current element is in the DOM
        // Otherwise send value always
        filter(() =>
          this.contextService.shadowDomService.isShadowRoot
            ? this.contextService.shadowDomService.currentHost.contains(
                this.el.nativeElement
              )
            : true
        ),
        debounceTime(500),
        takeUntilDestroyed(this.destroyRef)
      )
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
