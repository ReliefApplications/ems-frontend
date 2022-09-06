import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  SafeLayoutModalComponent,
  Layout,
  SafeGridLayoutService,
  SafeConfirmModalComponent,
  Resource,
} from '@safe/builder';
import { Apollo } from 'apollo-angular';
import get from 'lodash/get';
import {
  GetResourceByIdQueryResponse,
  GET_RESOURCE_LAYOUTS,
} from './graphql/queries';

/**
 * Layouts tab of resource page
 */
@Component({
  selector: 'app-layouts-tab',
  templateUrl: './layouts-tab.component.html',
  styleUrls: ['./layouts-tab.component.scss'],
})
export class LayoutsTabComponent implements OnInit {
  public resource!: Resource;
  public layouts: Layout[] = [];
  public loading = true;

  public displayedColumnsLayouts: string[] = ['name', 'createdAt', '_actions'];

  /**
   * Layouts tab of resource page
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param gridLayoutService Grid layout service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private gridLayoutService: SafeGridLayoutService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.resource = get(state, 'resource', null);

    this.apollo
      .query<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE_LAYOUTS,
        variables: {
          id: this.resource.id,
        },
      })
      .subscribe((res) => {
        if (res.data.resource) {
          this.layouts = res.data.resource.layouts || [];
        }
        this.loading = false;
      });
  }

  /**
   * Adds a new layout for the resource.
   */
  onAddLayout(): void {
    const dialogRef = this.dialog.open(SafeLayoutModalComponent, {
      disableClose: true,
      data: {
        queryName: this.resource.queryName,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.gridLayoutService
          .addLayout(value, this.resource.id)
          .subscribe((res: any) => {
            if (res.data.addLayout) {
              this.layouts = [
                ...(this.resource.layouts || []),
                res.data?.addLayout,
              ];
            }
          });
      }
    });
  }

  /**
   * Edits a layout. Opens a popup for edition.
   *
   * @param layout Layout to edit
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
          .editLayout(layout, value, this.resource.id)
          .subscribe((res: any) => {
            if (res.data.editLayout) {
              this.layouts = this.layouts.map((x: any) => {
                if (x.id === layout.id) {
                  return res.data.editLayout;
                } else {
                  return x;
                }
              });
            }
          });
      }
    });
  }

  /**
   * Deletes a layout.
   *
   * @param layout Layout to delete
   */
  onDeleteLayout(layout: Layout): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant('common.deleteObject', {
          name: this.translate.instant('common.layout.one'),
        }),
        content: this.translate.instant(
          'components.form.layout.delete.confirmationMessage',
          {
            name: layout.name,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        cancelText: this.translate.instant('components.confirmModal.cancel'),
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.gridLayoutService
          .deleteLayout(layout, this.resource.id)
          .subscribe((res: any) => {
            if (res.data.deleteLayout) {
              this.layouts = this.layouts.filter(
                (x: any) => x.id !== layout.id
              );
            }
          });
      }
    });
  }
}
