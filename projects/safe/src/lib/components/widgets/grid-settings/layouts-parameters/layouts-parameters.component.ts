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

  layouts: any[] = [];
  columns: string[] = ['name', 'createdAt', '_actions'];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    const defaultValue = this.selectedLayouts?.value;
    this.setSelectedLayouts(defaultValue);
    this.selectedLayouts?.valueChanges.subscribe((value) => {
      this.setSelectedLayouts(value);
    });
  }

  ngOnChanges(): void {
    const defaultValue = this.selectedLayouts?.value;
    this.setSelectedLayouts(defaultValue);
  }

  /**
   * Selects the layouts from the form value.
   *
   * @param value form control value.
   */
  private setSelectedLayouts(value: string[]): void {
    if (this.resource) {
      this.layouts =
        this.resource.layouts?.filter((x) => x.id && value.includes(x.id)) ||
        [];
    } else {
      this.layouts =
        this.form?.layouts?.filter((x) => x.id && value.includes(x.id)) || [];
    }
  }

  /**
   * Adds a new widget to the list.
   */
  public onAdd(): void {
    const dialogRef = this.dialog.open(AddLayoutComponent, {
      data: {
        layouts: this.form ? this.form.layouts : this.resource?.layouts,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.selectedLayouts?.setValue(
          this.selectedLayouts?.value.concat(value)
        );
      }
    });
  }

  /**
   * Edits existing layout.
   */
  onEditLayout(layout: Layout): void {
    console.log(layout);
  }

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
    console.log(layouts);
    moveItemInArray(layouts, event.previousIndex, event.currentIndex);
    console.log(layouts);
    this.selectedLayouts?.setValue(layouts);
  }
}
