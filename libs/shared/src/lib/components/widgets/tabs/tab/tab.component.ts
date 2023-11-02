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
  /** Reference to content view container */
  @ViewChild('content', { read: ViewContainerRef })
  content!: ViewContainerRef;
  /** Additional grid configuration */
  public gridOptions: GridsterConfig = {
    outerMargin: true,
  };

  ngAfterViewInit(): void {
    const componentRef = this.content.createComponent(WidgetGridComponent);
    componentRef.setInput('widgets', this.structure);
    componentRef.setInput('options', this.gridOptions);
    /** To use angular hooks */
    componentRef.changeDetectorRef.detectChanges();
  }
}
