import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  Output,
} from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { DOCUMENT } from '@angular/common';

/** Dialog data */
interface DialogData {
  widget: any;
}

/** Component for expanded widgets */
@Component({
  selector: 'safe-expanded-widget',
  templateUrl: './expanded-widget.component.html',
  styleUrls: ['./expanded-widget.component.scss'],
})
export class SafeExpandedWidgetComponent implements AfterViewInit, OnDestroy {
  // === EMIT STEP CHANGE FOR WORKFLOW ===
  @Output() changeStep: EventEmitter<number> = new EventEmitter();

  /**
   * Constructor for the component
   *
   * @param data The input data for the dialog
   * @param document Document
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit(): void {
    this.document.dispatchEvent(
      new CustomEvent('expandchange', { detail: { expanded: true } })
    );
  }

  ngOnDestroy(): void {
    this.document.dispatchEvent(
      new CustomEvent('expandchange', { detail: { expanded: false } })
    );
  }
}
