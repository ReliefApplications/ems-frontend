import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Layout } from '../../../../models/layout.model';
import { Form } from '../../../../models/form.model';
import { Resource } from '../../../../models/resource.model';
import { AddLayoutComponent } from '../add-layout/add-layout.component';
import { FormControl } from '@angular/forms';
import { moveItemInArray } from '@angular/cdk/drag-drop';

/**
 * Layouts list configuration for grid widgets
 */
@Component({
  selector: 'safe-layouts-parameters',
  templateUrl: './layouts-parameters.component.html',
  styleUrls: ['./layouts-parameters.component.scss'],
})
export class LayoutsParametersComponent implements OnInit, OnChanges {
  @Input() resource: Resource | null = null;
  @Input() form: Form | null = null;
  @Input() selectedLayouts: FormControl | null = null;

  @Output() add = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() edit = new EventEmitter();

  layouts: Layout[] = [];
  allLayouts: Layout[] = [];
  columns: string[] = ['name', 'createdAt', '_actions'];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    const defaultValue = this.selectedLayouts?.value;
    this.setAllLayouts();
    this.setSelectedLayouts(defaultValue);
    this.selectedLayouts?.valueChanges.subscribe((value) => {
      this.setSelectedLayouts(value);
    });
  }

  ngOnChanges(): void {
    const defaultValue = this.selectedLayouts?.value;
    this.setAllLayouts();
    this.setSelectedLayouts(defaultValue);
  }

  /**
   * Sets the list of all layouts from resource / form.
   */
  private setAllLayouts(): void {
    if (this.form) {
      this.allLayouts = this.form.layouts ? [...this.form.layouts] : [];
    } else {
      if (this.resource) {
        this.allLayouts = this.resource.layouts
          ? [...this.resource.layouts]
          : [];
      } else {
        this.allLayouts = [];
      }
    }
  }

  /**
   * Selects the layouts from the form value.
   *
   * @param value form control value.
   */
  private setSelectedLayouts(value: string[]): void {
    this.layouts =
      this.allLayouts.filter((x) => x.id && value.includes(x.id)) || [];
  }

  /**
   * Adds a new widget to the list.
   */
  public onAdd(): void {
    const dialogRef = this.dialog.open(AddLayoutComponent, {
      data: {
        layouts: this.form ? this.form.layouts : this.resource?.layouts,
        form: this.form,
        resource: this.resource,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        if (typeof value === 'string') {
          this.selectedLayouts?.setValue(
            this.selectedLayouts?.value.concat(value)
          );
        } else {
          this.allLayouts.push(value);
          this.selectedLayouts?.setValue(
            this.selectedLayouts?.value.concat(value.id)
          );
        }
      }
    });
  }

  /**
   * Edits existing layout.
   */
  onEditLayout(layout: Layout): void {}

  /**
   * Removes layout from list.
   *
   * @param layout Layout to remove.
   */
  onDeleteLayout(layout: Layout): void {
    this.selectedLayouts?.setValue(
      this.selectedLayouts?.value.filter((x: string) => x !== layout.id)
    );
  }

  /**
   * Reorders the layout list.
   *
   * @param event drop event
   */
  public drop(event: any): void {
    const layouts = [...this.selectedLayouts?.value];
    moveItemInArray(layouts, event.previousIndex, event.currentIndex);
    this.selectedLayouts?.setValue(layouts);
  }
}
