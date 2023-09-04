import { Dialog, DialogRef } from '@angular/cdk/dialog';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomWidgetStyleModalComponent } from '../custom-widget-style-modal/custom-widget-style-modal.component';

/**
 * Edition of a single tab, in tabs widget
 */
@Component({
  selector: 'safe-tab-settings',
  templateUrl: './tab-settings.component.html',
  styleUrls: ['./tab-settings.component.scss'],
})
export class TabSettingsComponent implements OnDestroy {
  @Input() tabGroup!: FormGroup;
  @Output() delete = new EventEmitter();

  private styleDialog?: DialogRef<any, any>;

  /**
   * Edition of a single tab, in tabs widget
   *
   * @param dialog CDK dialog service
   */
  constructor(private dialog: Dialog) {}

  /** @returns structure of the widget ( nested widgets ) */
  get structure() {
    return this.tabGroup.get('structure');
  }

  /** @returns get newest widget id from existing ids */
  get newestId(): number {
    const widgets = this.structure?.value.slice() || [];
    return widgets.length === 0
      ? 0
      : Math.max(...widgets.map((x: any) => x.id)) + 1;
  }

  /**
   * Move widget in the list
   *
   * @param e reorder event
   */
  onMove(e: any): void {
    const widgets = this.structure?.value.slice() || [];
    [widgets[e.oldIndex], widgets[e.newIndex]] = [
      widgets[e.newIndex],
      widgets[e.oldIndex],
    ];
    this.structure?.setValue(widgets);
  }

  /**
   * Edit a widget
   *
   * @param e edition event
   */
  onEdit(e: any) {
    const widgets = this.structure?.value.slice() || [];
    const index = widgets.findIndex((x: any) => x.ide === e.id);
    const options = widgets[index]?.settings?.defaultLayout
      ? {
          ...e.options,
          defaultLayout: widgets[index].settings.defaultLayout,
        }
      : e.options;
    if (options) {
      switch (e.type) {
        case 'display': {
          this.structure?.setValue(
            widgets.map((x: any) => {
              if (x.id === e.id) {
                x.defaultCols = options.cols;
                x.defaultRows = options.rows;
              }
              return x;
            })
          );
          break;
        }
        case 'data': {
          this.structure?.setValue(
            widgets.map((x: any) => {
              if (x.id === e.id) {
                x = { ...x, settings: options };
              }
              return x;
            })
          );
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  /**
   * Delete a widget
   *
   * @param e deletion event
   */
  onDelete(e: any) {
    const widgets = this.structure?.value.slice() || [];
    this.structure?.setValue(widgets.filter((x: any) => x.id !== e.id));
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
    const widget = JSON.parse(JSON.stringify(e));
    const widgets = this.structure?.value.slice() || [];
    widget.id = this.newestId;
    this.structure?.setValue([...widgets, widget]);
    // scroll to the element once it is created
    // setTimeout(() => {
    //   const el = document.getElementById(`widget-${widget.id}`);
    //   el?.scrollIntoView({ behavior: 'smooth' });
    // });
  }

  ngOnDestroy() {
    if (this.styleDialog) {
      this.styleDialog.close();
    }
  }
}
