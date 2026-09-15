import {
  AfterViewInit,
  Component,
  ComponentRef,
  HostBinding,
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
  /** Unique tab id, visible in the dom. */
  @HostBinding()
  @Input()
  id!: string;
  /** Structure of the tab ( list of widgets ) */
  @Input() structure: any;
  /** Dashboard owning the tabs widget. */
  @Input() dashboardId?: string;
  /** Stable path of the tabs widget within its dashboard. */
  @Input() widgetKey?: string;
  /** Should show padding */
  @Input() usePadding = true;
  /** Additional grid options */
  @Input() options?: GridsterConfig;
  /** Reference to content view container */
  @ViewChild('content', { read: ViewContainerRef })
  content!: ViewContainerRef;
  /** Component WidgetGridComponent created */
  public componentRef!: ComponentRef<WidgetGridComponent>;

  /** @returns Additional grid configuration */
  get gridOptions(): GridsterConfig {
    return {
      outerMargin: this.usePadding,
      ...this.options,
    };
  }

  ngAfterViewInit(): void {
    this.componentRef = this.content.createComponent(WidgetGridComponent);
    this.componentRef.setInput('widgets', this.structure);
    this.componentRef.setInput('options', this.gridOptions);
    // Nested widgets are identified by the tabs widget and the tab containing them
    this.componentRef.setInput('dashboardId', this.dashboardId);
    this.componentRef.setInput(
      'widgetKeyPrefix',
      this.widgetKey ? `${this.widgetKey}:${this.id}` : undefined
    );
    /** To use angular hooks */
    this.componentRef.changeDetectorRef.detectChanges();
  }
}
