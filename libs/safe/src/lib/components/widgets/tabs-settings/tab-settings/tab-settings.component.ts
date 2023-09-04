import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'safe-tab-settings',
  templateUrl: './tab-settings.component.html',
  styleUrls: ['./tab-settings.component.scss'],
})
export class TabSettingsComponent {
  @Input() tabGroup!: FormGroup;
  @Output() delete = new EventEmitter();

  get structure() {
    return this.tabGroup.get('structure');
  }

  get newestId(): number {
    const widgets = this.structure?.value.slice() || [];
    return widgets.length === 0
      ? 0
      : Math.max(...widgets.map((x: any) => x.id)) + 1;
  }

  onMove(e: any): void {
    const widgets = this.structure?.value.slice() || [];
    [widgets[e.oldIndex], widgets[e.newIndex]] = [
      widgets[e.newIndex],
      widgets[e.oldIndex],
    ];
    this.structure?.setValue(widgets);
  }

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

  onDelete(e: any) {
    const widgets = this.structure?.value.slice() || [];
    this.structure?.setValue(widgets.filter((x: any) => x.id !== e.id));
  }

  onStyle(e: any) {
    console.log('style');
  }

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
}
