import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Fullscreen helper component
 */
@Component({
  selector: 'safe-fullscreen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss'],
})
export class FullscreenComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mainContent', { static: true, read: ViewContainerRef })
  private mainContentRef!: ViewContainerRef;
  private mainContentViewRef!: ViewRef;
  mainContentView!: any;
  @ViewChild('rightSidenav', { static: true, read: ViewContainerRef })
  private rightSidenavRef!: ViewContainerRef;
  private rightSidenavViewRef!: ViewRef;
  rightSidenavView!: any;

  ngAfterViewInit(): void {
    this.setMainContent();
    this.setRightSidenavView();
  }

  setRightSidenavView() {
    if (this.rightSidenavView) {
      if (this.rightSidenavViewRef) {
        this.rightSidenavViewRef.destroy();
      }
      this.rightSidenavViewRef = this.rightSidenavRef.createEmbeddedView(
        this.rightSidenavView
      );
    }
  }

  setMainContent() {
    if (this.mainContentView) {
      if (this.mainContentViewRef) {
        this.mainContentViewRef.destroy();
      }
      this.mainContentViewRef = this.mainContentRef.createEmbeddedView(
        this.mainContentView
      );
    }
  }

  ngOnDestroy() {
    if (this.rightSidenavViewRef) {
      this.rightSidenavViewRef.destroy();
    }
    if (this.mainContentViewRef) {
      this.mainContentViewRef.destroy();
    }
  }
}
