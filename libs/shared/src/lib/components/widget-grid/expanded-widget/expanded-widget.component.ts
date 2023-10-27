import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
} from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { DOCUMENT } from '@angular/common';
import { DomPortal, PortalModule } from '@angular/cdk/portal';
import { ButtonModule, DialogModule } from '@oort-front/ui';

/** Widget data and template for class dialog */
interface WidgetData {
  element?: ElementRef<any>;
}

/** Expand widgets in a modal */
@Component({
  standalone: true,
  selector: 'shared-expanded-widget',
  templateUrl: './expanded-widget.component.html',
  styleUrls: ['./expanded-widget.component.scss'],
  imports: [DialogModule, ButtonModule, PortalModule],
})
export class ExpandedWidgetComponent implements AfterViewInit, OnDestroy {
  /** CDK portal */
  public portal?: DomPortal;

  /**
   * Expand widgets in a modal
   *
   * @param data Dialog data
   * @param document Document
   */
  constructor(
    @Inject(DIALOG_DATA) public data: WidgetData,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit(): void {
    this.document.dispatchEvent(
      new CustomEvent('expandchange', { detail: { expanded: true } })
    );
    this.portal = new DomPortal(this.data.element);
  }

  ngOnDestroy(): void {
    this.document.dispatchEvent(
      new CustomEvent('expandchange', { detail: { expanded: false } })
    );
  }
}
