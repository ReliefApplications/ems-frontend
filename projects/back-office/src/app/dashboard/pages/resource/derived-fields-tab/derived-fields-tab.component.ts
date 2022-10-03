import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  SafeEditDerivedFieldModalComponent,
  SafeGridLayoutService,
  SafeConfirmModalComponent,
  Resource,
} from '@safe/builder';
import { Apollo, QueryRef } from 'apollo-angular';
import get from 'lodash/get';
import {
  DERIVED_FIELD_UPDATE,
  DerivedFieldUpdateMutationResponse,
} from './graphql/mutations';

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
    const dialogRef = this.dialog.open(SafeEditDerivedFieldModalComponent, {
      disableClose: true,
      data: {
        field: null,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        console.log(value);
        this.apollo
          .mutate<DerivedFieldUpdateMutationResponse>({
            mutation: DERIVED_FIELD_UPDATE,
            variables: {
              resourceId: this.resource.id,
              derivedField: {
                add: {
                  name: value.name,
                  definition: value.definition.substring(
                    3,
                    value.definition.length - 4
                  ),
                },
              },
            },
          })
          .subscribe((res) => {
            if (res.data?.editResource) {
              // Needed to update the field as table data source
              this.fields = this.fields.concat(
                res.data.editResource.fields.find(
                  (f: any) => f.name === value.name
                )
              );
            }
          });
      }
    });
  }

  /**
   * Edits a layout. Opens a popup for edition.
   *
   * @param field Derived field to edit
   */
  onEditDerivedField(field: any): void {
    const dialogRef = this.dialog.open(SafeEditDerivedFieldModalComponent, {
      disableClose: true,
      data: {
        derivedField: field,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (!value) {
        return;
      }
      this.apollo
        .mutate<DerivedFieldUpdateMutationResponse>({
          mutation: DERIVED_FIELD_UPDATE,
          variables: {
            resourceId: this.resource.id,
            derivedField: {
              update: {
                oldName: field.name,
                name: value.name,
                definition: value.definition.substring(
                  3,
                  value.definition.length - 4
                ),
              },
            },
          },
        })
        .subscribe((res) => {
          if (res.data?.editResource) {
            // Needed to update the field as table data source
            this.fields = res.data.editResource.fields.filter(
              (f: any) => f.type === 'derived'
            );
          }
        });
    });
  }

  /**
   * Deletes a derived field.
   *
   * @param field Derived field to delete
   */
  onDeleteDerivedField(field: any): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant('common.deleteObject', {
          name: this.translate.instant('common.derivedField.one'),
        }),
        content: this.translate.instant(
          'components.derivedFields.delete.confirmationMessage',
          {
            name: field.name,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        cancelText: this.translate.instant('components.confirmModal.cancel'),
      },
    });

    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.apollo
          .mutate<DerivedFieldUpdateMutationResponse>({
            mutation: DERIVED_FIELD_UPDATE,
            variables: {
              resourceId: this.resource.id,
              derivedField: {
                remove: {
                  name: field.name,
                },
              },
            },
          })
          .subscribe((res) => {
            if (res.data?.editResource) {
              this.fields = this.fields.filter(
                (f: any) => f.name !== field.name
              );
            }
          });
      }
    });
  }
}
