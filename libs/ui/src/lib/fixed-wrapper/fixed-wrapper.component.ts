import {
  AfterViewInit,
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SafeLayoutService } from '@oort-front/safe';

/**
 * Fixed wrapper for bottoms floating div.
 */
@Component({
  selector: 'ui-fixed-wrapper',
  templateUrl: './fixed-wrapper.component.html',
  styleUrls: ['./fixed-wrapper.component.scss'],
})
export class FixedWrapperComponent implements AfterViewInit, OnDestroy {
  @ViewChild('fixedWrapperActions', { read: TemplateRef<any> })
  fixedWrapperActions?: TemplateRef<any>;

  /**
   * Fixed wrapper for bottoms floating div.
   *
   * @param safeLayoutService Layout service that handles view injection of the fixed wrapper component
   */
  constructor(private safeLayoutService: SafeLayoutService) {}

  ngAfterViewInit(): void {
    this.safeLayoutService.setFixedWrapperActions(
      this.fixedWrapperActions ?? null
    );
  }

  ngOnDestroy(): void {
    this.safeLayoutService.setFixedWrapperActions(null);
  }
}
