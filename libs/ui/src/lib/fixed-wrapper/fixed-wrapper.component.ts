import {
  AfterViewInit,
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UILayoutService } from '../sidenav/layout/layout.service';

/**
 * Fixed wrapper for bottoms floating div.
 */
@Component({
  selector: 'ui-fixed-wrapper',
  templateUrl: './fixed-wrapper.component.html',
  styleUrls: ['./fixed-wrapper.component.scss'],
})
export class FixedWrapperComponent implements AfterViewInit, OnDestroy {
  /** Reference to fixed wrapper template */
  @ViewChild('fixedWrapperActions', { read: TemplateRef<any> })
  fixedWrapperActions?: TemplateRef<any>;

  /**
   * Fixed wrapper for bottoms floating div.
   *
   * @param layoutService Layout service that handles view injection of the fixed wrapper component
   */
  constructor(private layoutService: UILayoutService) {}

  ngAfterViewInit(): void {
    this.layoutService.setFixedWrapperActions(this.fixedWrapperActions ?? null);
  }

  ngOnDestroy(): void {
    this.layoutService.setFixedWrapperActions(null);
  }
}
