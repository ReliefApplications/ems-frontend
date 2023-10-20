import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { WidgetGridComponent } from '../../../widget-grid/widget-grid.component';

/**
 * Tab component, part of tabs widget.
 */
@Component({
  selector: 'shared-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements AfterViewInit {
  @Input() structure: any;
  @ViewChild('content', { read: ViewContainerRef })
  content!: ViewContainerRef;

  ngAfterViewInit(): void {
    const componentRef = this.content.createComponent(WidgetGridComponent);
    componentRef.setInput('widgets', this.structure);
    /** To use angular hooks */
    componentRef.changeDetectorRef.detectChanges();
  }
}
