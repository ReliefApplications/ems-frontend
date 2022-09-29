import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  SafeEditLayoutModalComponent,
  SafeGridLayoutService,
  SafeConfirmModalComponent,
  Resource,
} from '@safe/builder';
import { Apollo, QueryRef } from 'apollo-angular';
import get from 'lodash/get';

/**
 * Derived fields tab of resource page
 */
@Component({
  selector: 'app-derived-fields-tab',
  templateUrl: './derived-fields-tab.component.html',
  styleUrls: ['./derived-fields-tab.component.scss'],
})
export class DerivedFieldsTabComponent implements OnInit {
  public resource!: Resource;
  public fields: any[] = [];

  public displayedColumns: string[] = ['name', 'createdAt', '_actions'];

  /**
   * Layouts tab of resource page
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.resource = get(state, 'resource', null);

    this.fields = this.resource.fields.filter((f: any) => f.type === 'derived');
  }

  /**
   * Adds a new derived field for the resource.
   */
  onAddDerivedField(): void {
    // const dialogRef = this.dialog.open(SafeEditLayoutModalComponent, {
    //   disableClose: true,
    //   data: {
    //     queryName: this.resource.queryName,
    //   },
    // });
    // dialogRef.afterClosed().subscribe((value) => {
    //   if (value) {
    //     this.gridLayoutService
    //       .addLayout(value, this.resource.id)
    //       .subscribe((res: any) => {
    //         if (res.data.addLayout) {
    //           this.layouts = [...this.layouts, res.data?.addLayout];
    //         }
    //       });
    //   }
    // });
  }

  /**
   * Edits a layout. Opens a popup for edition.
   *
   * @param field Derived field to edit
   */
  onEditDerivedField(field: any): void {
    // const dialogRef = this.dialog.open(SafeEditLayoutModalComponent, {
    //   disableClose: true,
    //   data: {
    //     layout,
    //   },
    // });
    // dialogRef.afterClosed().subscribe((value) => {
    //   if (value) {
    //     this.gridLayoutService
    //       .editLayout(layout, value, this.resource.id)
    //       .subscribe((res: any) => {
    //         if (res.data.editLayout) {
    //           this.layouts = this.layouts.map((x: any) => {
    //             if (x.id === layout.id) {
    //               return res.data.editLayout;
    //             } else {
    //               return x;
    //             }
    //           });
    //         }
    //       });
    //   }
    // });
  }

  /**
   * Deletes a derived field.
   *
   * @param field Derived field to delete
   */
  onDeleteDerivedField(field: any): void {
    // const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
    //   data: {
    //     title: this.translate.instant('common.deleteObject', {
    //       name: this.translate.instant('common.layout.one'),
    //     }),
    //     content: this.translate.instant(
    //       'components.form.layout.delete.confirmationMessage',
    //       {
    //         name: layout.name,
    //       }
    //     ),
    //     confirmText: this.translate.instant('components.confirmModal.delete'),
    //     cancelText: this.translate.instant('components.confirmModal.cancel'),
    //   },
    // });
    // dialogRef.afterClosed().subscribe((value) => {
    //   if (value) {
    //     this.gridLayoutService
    //       .deleteLayout(layout, this.resource.id)
    //       .subscribe((res: any) => {
    //         if (res.data.deleteLayout) {
    //           this.layouts = this.layouts.filter(
    //             (x: any) => x.id !== layout.id
    //           );
    //         }
    //       });
    //   }
    // });
  }
}
