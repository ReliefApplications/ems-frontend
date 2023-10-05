import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
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
export class TabComponent implements AfterViewInit, OnChanges {
  @Input() structure: any;
  @Input() inView?: boolean;
  @ViewChild('content', { read: ViewContainerRef })
  content!: ViewContainerRef;

  private isLoaded = true;

  ngAfterViewInit(): void {
    this.isLoaded = false;
    if (this.inView && !this.isLoaded) {
      this.loadTab();
    }
  }

  ngOnChanges(): void {
    if (this.inView && !this.isLoaded) {
      this.loadTab();
    }
  }

  /**
   * Load the tab if it's selected
   */
  private loadTab(): void {
    this.isLoaded = true;
    const componentRef = this.content.createComponent(WidgetGridComponent);
    componentRef.setInput('widgets', this.structure);
  }
}
