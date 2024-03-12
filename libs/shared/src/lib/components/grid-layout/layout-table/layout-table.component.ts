import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Layout } from '../../../models/layout.model';
import { Form } from '../../../models/form.model';
import { Resource } from '../../../models/resource.model';
import { UntypedFormControl } from '@angular/forms';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import get from 'lodash/get';
import { GridLayoutService } from '../../../services/grid-layout/grid-layout.service';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { Dialog } from '@angular/cdk/dialog';

/**
 * Layouts list configuration for grid widgets
 */
@Component({
  selector: 'shared-layout-table',
  templateUrl: './layout-table.component.html',
  styleUrls: ['./layout-table.component.scss'],
})
export class LayoutTableComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges
{
  /** Resource to display */
  @Input() resource: Resource | null = null;
  /** Form to display */
  @Input() form: Form | null = null;
  /** Selected layouts form control */
  @Input() selectedLayouts: UntypedFormControl | null = null;
  /** Single input boolean control */
  @Input() singleInput = false;

  /** List of layouts */
  layouts: Layout[] = [];
  /** List of all layouts */
  allLayouts: Layout[] = [];
  /** List of displayed columns */
  columns: string[] = ['name', 'createdAt', '_actions'];

  /**
   * Constructor of the layout list component
   *
   * @param dialog Dialog Service
   * @param gridLayoutService The shared grid layout service
   */
  constructor(
    private dialog: Dialog,
    private gridLayoutService: GridLayoutService
  ) {
    super();
  }

  ngOnInit(): void {
    const defaultValue = this.selectedLayouts?.value;
    this.setAllLayouts();
    this.setSelectedLayouts(defaultValue);
    this.selectedLayouts?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
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
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...this.form.layouts.edges?.map((e) => e.node)]
        : [];
    } else {
      if (this.resource) {
        this.allLayouts = this.resource.layouts
          ? // eslint-disable-next-line no-unsafe-optional-chaining
            [...this.resource.layouts.edges?.map((e) => e.node)]
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
      this.allLayouts
        .filter((x) => x.id && value.includes(x.id))
        .sort(
          (a, b) => value.indexOf(a.id || '') - value.indexOf(b.id || '')
        ) || [];
  }

  /**
   * Adds a new layout to the list.
   */
  public async onAdd(): Promise<void> {
    const { AddLayoutModalComponent } = await import(
      '../add-layout-modal/add-layout-modal.component'
    );
    const dialogRef = this.dialog.open(AddLayoutModalComponent, {
      data: {
        hasLayouts:
          get(this.form ? this.form : this.resource, 'layouts.totalCount', 0) >
          0, // check if at least one existing layout
        form: this.form,
        resource: this.resource,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        if (!this.allLayouts.find((x) => x.id === value.id)) {
          this.allLayouts.push(value);
          this.resource?.layouts?.edges?.push({
            node: value,
            cursor: value.id,
          });
        }
        this.selectedLayouts?.setValue(
          this.selectedLayouts?.value.concat(value.id)
        );
      }
    });
  }

  /**
   * Edits existing layout.
   *
   * @param layout The layout to edit
   */
  async onEditLayout(layout: Layout): Promise<void> {
    const { EditLayoutModalComponent } = await import(
      '../edit-layout-modal/edit-layout-modal.component'
    );
    const dialogRef = this.dialog.open(EditLayoutModalComponent, {
      disableClose: true,
      data: {
        layout,
        queryName: this.resource?.queryName,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.gridLayoutService
          .editLayout(layout, value, this.resource?.id, this.form?.id)
          .subscribe({
            next: ({ data }: any) => {
              if (data.editLayout) {
                const layouts = [...this.allLayouts];
                const index = layouts.findIndex((x) => x.id === layout.id);
                layouts[index] = data.editLayout;
                this.allLayouts = layouts;
                this.setSelectedLayouts(this.selectedLayouts?.value);
              }
            },
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
    // eslint-disable-next-line no-unsafe-optional-chaining
    const layouts = [...this.selectedLayouts?.value];
    moveItemInArray(layouts, event.previousIndex, event.currentIndex);
    this.selectedLayouts?.setValue(layouts);
  }
}
