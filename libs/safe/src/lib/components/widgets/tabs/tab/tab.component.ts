import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { SafeWidgetGridComponent } from '../../../widget-grid/widget-grid.component';

/**
 * Tab component, part of tabs widget.
 */
@Component({
  selector: 'safe-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements AfterViewInit {
  @Input() structure: any;
  @ViewChild('content', { read: ViewContainerRef })
  content!: ViewContainerRef;

  ngAfterViewInit(): void {
    const componentRef = this.content.createComponent(SafeWidgetGridComponent);
    componentRef.setInput('widgets', this.structure);
  }
}
