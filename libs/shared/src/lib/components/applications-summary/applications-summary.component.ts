import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
} from '@angular/core';
import { Application } from '../../models/application.model';
import { SidenavContainerComponent } from '@oort-front/ui';
import { DOCUMENT } from '@angular/common';

/**
 * This component is used to display the most recent applications and a button to create a new application
 */
@Component({
  selector: 'shared-applications-summary',
  templateUrl: './applications-summary.component.html',
  styleUrls: ['./applications-summary.component.scss'],
})
export class ApplicationsSummaryComponent implements AfterViewInit {
  /** Loading indicator */
  @Input() loading = false;
  /** Can user create new applications */
  @Input() canCreate = false;
  /** Available applications */
  @Input() applications: Application[] = [];
  /** Emits an event when a new application is added. */
  @Output() add = new EventEmitter();
  /** Emits an event with the application ID when an application is opened. */
  @Output() openApplication = new EventEmitter<string>();
  /** Emits an event with the application when a preview is requested. */
  @Output() preview = new EventEmitter<Application>();
  /** Emits an event with the application when a deletion is requested. */
  @Output() delete = new EventEmitter<Application>();
  /** Emits an event with the application when a clone is requested. */
  @Output() clone = new EventEmitter<Application>();
  /** Emits an event with the application when a clone is requested. */
  @Output() editAccess = new EventEmitter<Application>();
  /** Padding of the appPageContainer */
  private appPageContainerPadding = 0;

  /**
   * This component is used to display the most recent applications and a button to create a new application
   *
   * @param _host host sidenav container
   * @param document Document
   */
  constructor(
    @Optional() private _host: SidenavContainerComponent,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit() {
    const appPageContainer = this.document.getElementById('appPageContainer');
    if (appPageContainer) {
      const getPadding = (direction: 'left' | 'right') =>
        parseFloat(
          window
            .getComputedStyle(appPageContainer)
            .getPropertyValue(`padding-${direction}`)
        );
      this.appPageContainerPadding = getPadding('right') + getPadding('left');
    }
  }

  /**
   * get the max width for the application summary
   *
   * @returns a max width to not exceed the container
   */
  get maxWidth() {
    if (this._host.showSidenav[0]) {
      return `${window.innerWidth - this.appPageContainerPadding - 240}px`; //not ideal to hardcode the width, but if we get the width from the navbar, it changes
    }
    return `${window.innerWidth - this.appPageContainerPadding}px`;
  }
}
