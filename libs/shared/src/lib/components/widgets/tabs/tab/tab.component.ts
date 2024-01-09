import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { WidgetGridComponent } from '../../../widget-grid/widget-grid.component';
import { GridsterConfig } from 'angular-gridster2';

/**
 * Tab component, part of tabs widget.
 */
@Component({
  selector: 'shared-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements AfterViewInit, OnChanges {
  /** Structure of the tab ( list of widgets ) */
  @Input() structure: any;
  /** Should show padding */
  @Input() usePadding = true;
  /** Additional grid options */
  @Input() options?: GridsterConfig;
  /** Tabs width and height */
  @Input() tabsSize: any = {};
  /** Reference to content view container */
  @ViewChild('content', { read: ViewContainerRef })
  content!: ViewContainerRef;
  /** Widget grid component ref */
  WidgetGridComponentRef: any;

  /** @returns Additional grid configuration */
  get gridOptions(): GridsterConfig {
    return {
      outerMargin: this.usePadding,
      ...this.options,
    };
  }

  ngAfterViewInit(): void {
    this.WidgetGridComponentRef =
      this.content.createComponent(WidgetGridComponent);
    this.WidgetGridComponentRef.setInput('widgets', this.structure);
    this.WidgetGridComponentRef.setInput('options', this.gridOptions);
    this.WidgetGridComponentRef.setInput('tabSize', this.tabsSize);
    /** To use angular hooks */
    this.WidgetGridComponentRef.changeDetectorRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabsSize']) {
      this.WidgetGridComponentRef.setInput('tabSize', this.tabsSize);
    }
  }
}
