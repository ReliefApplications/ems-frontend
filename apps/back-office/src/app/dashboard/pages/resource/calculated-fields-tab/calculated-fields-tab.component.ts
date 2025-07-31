import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EditResourceMutationResponse, Resource } from '@oort-front/shared';
import { Apollo } from 'apollo-angular';
import get from 'lodash/get';
import { Calculated_FIELD_UPDATE } from './graphql/mutations';
import { Dialog } from '@angular/cdk/dialog';
import { SnackbarService } from '@oort-front/ui';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Calculated fields tab of resource page
 */
@Component({
  selector: 'app-calculated-fields-tab',
  templateUrl: './calculated-fields-tab.component.html',
  styleUrls: ['./calculated-fields-tab.component.scss'],
})
export class CalculatedFieldsTabComponent implements OnInit {
  /**
   * Resource
   */
  public resource!: Resource;
  /**
   * Calculated fields
   */
  public fields: any[] = [];

  /**
   * Columns to display
   */
  public displayedColumns: string[] = ['name', 'createdAt', '_actions'];
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Layouts tab of resource page
   *
   * @param apollo Apollo service
   * @param dialog Dialog service
   * @param translate Angular translate service
   * @param snackBar Shared snackbar service
   */
  constructor(
    private apollo: Apollo,
    private dialog: Dialog,
    private translate: TranslateService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.resource = get(state, 'resource', null);

    if (this.resource && this.resource.fields) {
      this.fields = this.resource.fields.filter((f: any) => f.isCalculated);
    } else {
      this.fields = [];
    }
  }

  /**
   * Adds a new Calculated field for the resource.
   */
  async onAddCalculatedField(): Promise<void> {
    const { EditCalculatedFieldModalComponent } = await import(
      '@oort-front/shared'
    );
    const dialogRef = this.dialog.open(EditCalculatedFieldModalComponent, {
      disableClose: true,
      data: {
        calculatedField: null,
        resourceFields: this.resource.fields.filter(
          (f: any) => !f.isCalculated
        ),
      },
    });
    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        this.handleCalculatedFieldResponse(value);
      });
  }

  /**
   * Edits a layout. Opens a popup for edition.
   *
   * @param field Calculated field to edit
   */
  async onEditCalculatedField(field: any): Promise<void> {
    const { EditCalculatedFieldModalComponent } = await import(
      '@oort-front/shared'
    );
    const dialogRef = this.dialog.open(EditCalculatedFieldModalComponent, {
      disableClose: true,
      data: {
        calculatedField: field,
        resourceFields: this.resource.fields.filter(
          (f: any) => !f.isCalculated
        ),
      },
    });
    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        this.handleCalculatedFieldResponse(value, field);
      });
  }

  /**
   * Handle calculated field mutation response for add/update a calculated field
   *
   * @param value retrieved from the mutation response
   * @param field field to update if it's an update mutation
   */
  private handleCalculatedFieldResponse(value: any, field?: any) {
    if (value) {
      const expression = value.expression
        .replace(/<[^>]*>/gi, ' ')
        .replace(/<\/[^>]*>/gi, ' ')
        .replace(/&nbsp;|&#160;/gi, ' ')
        .replace(/\s+/gi, ' ')
        .trim();
      this.apollo
        .mutate<EditResourceMutationResponse>({
          mutation: Calculated_FIELD_UPDATE,
          variables: {
            resourceId: this.resource.id,
            calculatedField: {
              ...(!field && {
                add: {
                  name: value.name,
                  expression,
                },
              }),
              ...(field && {
                update: {
                  oldName: field.name,
                  name: value.name,
                  expression,
                },
              }),
            },
          },
        })
        .subscribe({
          next: ({ data, errors }) => {
            if (data?.editResource) {
              // Needed to update the field as table data source
              this.fields = field
                ? data.editResource.fields.filter((f: any) => f.isCalculated)
                : this.fields.concat(
                    data.editResource.fields.find(
                      (f: any) => f.name === value.name
                    )
                  );
            }
            if (errors) {
              this.snackBar.openSnackBar(errors[0].message, {
                error: true,
              });
            } else {
              if (!field) {
                // New field
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectCreated', {
                    type: this.translate
                      .instant('common.calculatedField.one')
                      .toLowerCase(),
                    value: value.name,
                  })
                );
              } else {
                // Existing field
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectUpdated', {
                    type: this.translate
                      .instant('common.calculatedField.one')
                      .toLowerCase(),
                    value: value.name,
                  })
                );
              }
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Deletes a Calculated field.
   *
   * @param field Calculated field to delete
   */
  async onDeleteCalculatedField(field: any): Promise<void> {
    const { ConfirmModalComponent } = await import('@oort-front/shared');
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translate.instant('common.deleteObject', {
          name: this.translate.instant('common.calculatedField.one'),
        }),
        content: this.translate.instant(
          'components.calculatedFields.delete.confirmationMessage',
          {
            name: field.name,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        cancelText: this.translate.instant('components.confirmModal.cancel'),
      },
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        if (value) {
          this.apollo
            .mutate<EditResourceMutationResponse>({
              mutation: Calculated_FIELD_UPDATE,
              variables: {
                resourceId: this.resource.id,
                calculatedField: {
                  remove: {
                    name: field.name,
                  },
                },
              },
            })
            .subscribe({
              next: ({ data, errors }) => {
                if (data?.editResource) {
                  this.fields = this.fields.filter(
                    (f: any) => f.name !== field.name
                  );
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'common.notifications.objectDeleted',
                      {
                        value: this.translate.instant(
                          'common.calculatedField.one'
                        ),
                      }
                    )
                  );
                }
                if (errors) {
                  this.snackBar.openSnackBar(errors[0].message, {
                    error: true,
                  });
                }
              },
              error: (err) => {
                this.snackBar.openSnackBar(err.message, { error: true });
              },
            });
        }
      });
  }
}
