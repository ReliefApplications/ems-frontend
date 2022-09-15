import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Layout } from '../../../models/layout.model';
import { Form } from '../../../models/form.model';
import { Resource } from '../../../models/resource.model';
import { AddLayoutComponent } from '../add-layout/add-layout.component';
import { FormControl } from '@angular/forms';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { SafeGridLayoutService } from '../../../services/grid-layout.service';
import { SafeLayoutModalComponent } from '../layout-modal/layout-modal.component';

/**
 * Layouts list configuration for grid widgets
 */
@Component({
  selector: 'safe-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss'],
})
export class LayoutsComponent implements OnInit, OnChanges {
  @Input() resource: Resource | null = null;
  @Input() form: Form | null = null;
  @Input() selectedLayouts: FormControl | null = null;
  @Input() singleInput = false;

  layouts: Layout[] = [];
  allLayouts: Layout[] = [];
  columns: string[] = ['name', 'createdAt', '_actions'];

  /**
   * Constructor of the layout list component
   *
   * @param dialog Material Dialog Service
   * @param gridLayoutService The safe grid layout service
   */
  constructor(
    private dialog: MatDialog,
    private gridLayoutService: SafeGridLayoutService
  ) {}

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
      this.allLayouts = this.form.layouts
        ? this.form.layouts.edges?.map((e) => e.node)
        : [];
    } else {
      if (this.resource) {
        this.allLayouts = this.resource.layouts
          ? this.resource.layouts.edges?.map((e) => e.node)
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
  private setSelectedLayouts(value: string[] | string): void {
    if (this.singleInput) {
      this.layouts = this.allLayouts.filter((x) => x.id && value === x.id);
    } else {
      this.layouts =
        this.allLayouts
          .filter((x) => x.id && value.includes(x.id))
          .sort(
            (a, b) => value.indexOf(a.id || '') - value.indexOf(b.id || '')
          ) || [];
    }
  }

  /**
   * Adds a new layout to the list.
   */
  public onAdd(): void {
    const layouts =
      (this.form ? this.form.layouts : this.resource?.layouts)?.edges?.map(
        (e) => e.node
      ) || [];
    const dialogRef = this.dialog.open(AddLayoutComponent, {
      data: {
        layouts,
        form: this.form,
        resource: this.resource,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        if (!this.singleInput) {
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
        } else {
          if (typeof value === 'string') {
            this.selectedLayouts?.setValue(value);
          } else {
            this.allLayouts = [value];
            this.selectedLayouts?.setValue(value.id);
          }
        }
      }
    });
  }

  /**
   * Edits existing layout.
   *
   * @param layout The layout to edit
   */
  onEditLayout(layout: Layout): void {
    const dialogRef = this.dialog.open(SafeLayoutModalComponent, {
      disableClose: true,
      data: {
        layout,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.gridLayoutService
          .editLayout(layout, value, this.resource?.id, this.form?.id)
          .subscribe((res: any) => {
            if (res.data.editLayout) {
              const layouts = [...this.allLayouts];
              const index = layouts.findIndex((x) => x.id === layout.id);
              layouts[index] = res.data.editLayout;
              this.allLayouts = layouts;
              this.setSelectedLayouts(this.selectedLayouts?.value);
            }
          });
      }
    });
  }

  /**
   * Removes layout from list.
   *
   * @param layout Layout to remove.
   */
  onDeleteLayout(layout: Layout): void {
    if (this.singleInput) {
      this.selectedLayouts?.setValue(
        this.selectedLayouts?.value.filter((x: string) => x !== layout.id)
      );
    } else {
      this.selectedLayouts?.setValue(null);
    }
  }

  /**
   * Reorders the layout list.
   *
   * @param event drop event
   */
  public drop(event: any): void {
    if (!this.singleInput) {
      const layouts = [...this.selectedLayouts?.value];
      moveItemInArray(layouts, event.previousIndex, event.currentIndex);
      this.selectedLayouts?.setValue(layouts);
    }
  }
}
