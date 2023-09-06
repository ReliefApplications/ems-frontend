import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
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
export class TabComponent implements AfterViewInit, OnChanges {
  @Input() structure: any;
  @Input() inView?: boolean;
  @ViewChild('content', { read: ViewContainerRef })
  content!: ViewContainerRef;

  private isLoaded = true;
  private componentRef: any;

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
    this.componentRef = this.content.createComponent(SafeWidgetGridComponent);
    this.componentRef.setInput('loading', true);
    this.componentRef.setInput('widgets', this.structure);
    // Temporary solution for map loading issue, we delay the rendering of widgets 2ms
    setTimeout(() => {
      this.componentRef.setInput('loading', false);
    }, 200);
  }
}
