import { Dialog, DialogRef } from '@angular/cdk/dialog';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomWidgetStyleModalComponent } from '../custom-widget-style-modal/custom-widget-style-modal.component';
import { cloneDeep } from 'lodash';
import { WidgetGridComponent } from '../../../widget-grid/widget-grid.component';
import { DOCUMENT } from '@angular/common';
import { GridsterConfig } from 'angular-gridster2';

/**
 * Edition of a single tab, in tabs widget
 */
@Component({
  selector: 'shared-tab-settings',
  templateUrl: './tab-settings.component.html',
  styleUrls: ['./tab-settings.component.scss'],
})
export class TabSettingsComponent implements OnDestroy {
  /** Tab form group */
  @Input() tabGroup!: FormGroup;
  /** Delete tab event emitter */
  @Output() delete = new EventEmitter();
  /** Widget grid reference */
  @ViewChild(WidgetGridComponent)
  widgetGridComponent!: WidgetGridComponent;
  /** Additional grid configuration */
  public gridOptions: GridsterConfig = {
    outerMargin: false,
  };
  /** Reference to style dialog, when opened */
  private styleDialog?: DialogRef<any, any>;
  /** Timeout to scroll to newly added widget */
  private timeoutListener!: NodeJS.Timeout;

  /**
   * Edition of a single tab, in tabs widget
   *
   * @param dialog Dialog service
   * @param document Document
   */
  constructor(
    private dialog: Dialog,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /** @returns structure of the widget ( nested widgets ) */
  get structure() {
    return this.tabGroup.get('structure');
  }

  /**
   * Edit a widget
   *
   * @param e edition event
   */
  onEdit(e: any) {
    const widgets = this.structure?.value.slice() || [];
    switch (e.type) {
      case 'display': {
        break;
      }
      case 'data': {
        // Find the widget to be edited
        const widgetComponents =
          this.widgetGridComponent.widgetComponents.toArray();
        const targetIndex = widgetComponents.findIndex(
          (v: any) => v.id === e.id
        );
        if (targetIndex > -1) {
          // Update the configuration
          const options = widgets[targetIndex]?.settings?.defaultLayout
            ? {
                ...e.options,
                defaultLayout: widgets[targetIndex].settings.defaultLayout,
              }
            : e.options;
          if (options) {
            // Save configuration
            widgets[targetIndex] = {
              ...widgets[targetIndex],
              settings: options,
            };
          }
        }
        this.structure?.setValue(widgets);
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Delete a widget
   *
   * @param e deletion event
   */
  onDelete(e: any) {
    const widgetComponents =
      this.widgetGridComponent.widgetComponents.toArray();
    const targetIndex = widgetComponents.findIndex((x) => x.id === e.id);
    if (targetIndex > -1) {
      const widgets = this.structure?.value.slice() || [];
      widgets.splice(targetIndex, 1);
      this.structure?.setValue(widgets);
    }
  }

  /**
   * Style a widget, opening custom widget style component
   *
   * @param e style event
   */
  async onStyle(e: any) {
    if (this.styleDialog) {
      this.styleDialog.close();
    }
    this.styleDialog = this.dialog.open(CustomWidgetStyleModalComponent, {
      data: {
        widgetComp: e,
        save: (widget: any) => this.onEdit(widget),
      },
      hasBackdrop: false,
      disableClose: true,
      panelClass: ['h-full', 'ml-auto'],
    });
  }

  /**
   * Add a new widget
   *
   * @param e event
   */
  onAdd(e: any): void {
    const widget = cloneDeep(e);
    const widgets = this.structure?.value.slice() || [];
    this.structure?.setValue([...widgets, widget]);
    if (this.timeoutListener) {
      clearTimeout(this.timeoutListener);
    }
    // scroll to the element once it is created
    this.timeoutListener = setTimeout(() => {
      const widgetComponents =
        this.widgetGridComponent.widgetComponents.toArray();
      const target = widgetComponents[widgetComponents.length - 1];
      const el = this.document.getElementById(target.id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  }

  ngOnDestroy() {
    if (this.styleDialog) {
      this.styleDialog.close();
    }
    if (this.timeoutListener) {
      clearTimeout(this.timeoutListener);
    }
  }
}
