import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BreadcrumbDisplay } from './types/breadcrumb-display';
import { BreadcrumbSeparator } from './types/breadcrumb-separator';
import { Breadcrumb } from './interfaces/breadcrumb.interface';
import { isEqual } from 'lodash';
/**
 * UI Breadcrumbs Component
 * Breadcrumbs are a secondary navigation scheme that allows the user to see where the current page is in relation to the Web site's hierarchy.
 */
@Component({
  selector: 'ui-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnChanges, OnDestroy {
  /** Array of Breadcrumb objects. */
  @Input() breadcrumbs: Breadcrumb[] = [];
  /** Separator between breadcrumbs. */
  @Input() separator: BreadcrumbSeparator = 'slash';
  /** Display style of breadcrumbs. */
  @Input() display: BreadcrumbDisplay = 'simple';
  /** Reference to the breadcrumb list element. */
  @ViewChild('breadcrumbList', { static: true, read: ElementRef })
  breadcrumbList!: ElementRef<HTMLOListElement>;
  /** Boolean indicating if breadcrumb is off limits. */
  isBreadcrumbOffLimits = false;
  /** Width of the expanded breadcrumb. */
  expandedWidth = 0;
  /** Timeout to load Breadcrumb */
  private loadBreadcrumbTimeoutListener!: NodeJS.Timeout;
  /** Method to update off limit value when breadcrumbs change. */

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['breadcrumbs'] &&
      !isEqual(
        changes['breadcrumbs'].currentValue,
        changes['breadcrumbs'].previousValue
      )
    ) {
      this.updateOffLimitValue();
    }
  }

  ngOnDestroy(): void {
    if (this.loadBreadcrumbTimeoutListener) {
      clearTimeout(this.loadBreadcrumbTimeoutListener);
    }
  }

  /**
   * Update off limit value for the given breadcrumb
   */
  private updateOffLimitValue(): void {
    this.loadBreadcrumb().then(() => {
      // Save the width with all the texts visible to handle minimal or full display later
      this.expandedWidth = this.breadcrumbList?.nativeElement?.clientWidth;
      // Check if the breadcrumb is within screen limits on load
      this.isBreadcrumbOffLimits = window.innerWidth < this.expandedWidth;
    });
  }

  /**
   * Keep checking until breadcrumb is fully load
   */
  private loadBreadcrumb(): Promise<void> {
    const checkAgain = (resolve: () => void) => {
      if (this.breadcrumbs.every((bc) => bc.key || bc.text)) {
        if (this.loadBreadcrumbTimeoutListener) {
          clearTimeout(this.loadBreadcrumbTimeoutListener);
        }
        resolve();
      } else {
        if (this.loadBreadcrumbTimeoutListener) {
          clearTimeout(this.loadBreadcrumbTimeoutListener);
        }
        this.loadBreadcrumbTimeoutListener = setTimeout(
          () => checkAgain(resolve),
          400
        );
      }
    };
    return new Promise(checkAgain);
  }

  /**
   * Change the display depending on windows size.
   *
   * @param event Event that implies a change in window size
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isBreadcrumbOffLimits = event.target.innerWidth < this.expandedWidth;
  }
}
