import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
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
export class TabComponent implements AfterViewInit {
  /** Structure of the tab ( list of widgets ) */
  @Input() structure: any;
  /** Should show padding */
  @Input() usePadding = true;
  /** Additional grid options */
  @Input() options?: GridsterConfig;
  /** Reference to content view container */
  @ViewChild('content', { read: ViewContainerRef })
  content!: ViewContainerRef;

  /** @returns Additional grid configuration */
  get gridOptions(): GridsterConfig {
    return {
      outerMargin: this.usePadding,
      ...this.options,
    };
  }

  ngAfterViewInit(): void {
    const componentRef = this.content.createComponent(WidgetGridComponent);
    componentRef.setInput('widgets', { ...this.structure });
    componentRef.setInput('options', { ...this.gridOptions });
    /** To use angular hooks */
    componentRef.changeDetectorRef.detectChanges();
  }
}
