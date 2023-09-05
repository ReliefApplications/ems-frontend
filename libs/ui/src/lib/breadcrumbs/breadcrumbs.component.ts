import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BreadcrumbDisplay } from './types/breadcrumb-display';
import { BreadcrumbSeparator } from './types/breadcrumb-separator';
import { Breadcrumb } from './interfaces/breadcrumb.interface';
import { isEqual } from 'lodash';
/**
 * UI Breadcrumbs Component
 */
@Component({
  selector: 'ui-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnChanges {
  @Input() breadcrumbs: Breadcrumb[] = [];
  @Input() separator: BreadcrumbSeparator = 'slash';
  @Input() display: BreadcrumbDisplay = 'simple';

  @ViewChild('breadcrumbList', { static: true, read: ElementRef })
  breadcrumbList!: ElementRef<HTMLOListElement>;

  isBreadcrumbOffLimits = false;
  expandedWidth = 0;

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
        resolve();
      } else {
        setTimeout(() => checkAgain(resolve), 400);
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
