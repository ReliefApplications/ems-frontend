import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  ResourceQueryResponse,
  UnsubscribeComponent,
} from '@oort-front/shared';
import { Apollo } from 'apollo-angular';
import { takeUntil } from 'rxjs';
import { GET_RESOURCE_BY_ID } from './graphql/queries';
import { SnackbarService } from '@oort-front/ui';
import { Model } from 'survey-core';

/**
 * Interface with the resource import field data
 * (The field that will be used when importing data from a excel file)
 */
interface DialogData {
  resourceId: string;
}

/**
 * Modal to update resource import field.
 */
@Component({
  selector: 'app-import-field-modal',
  templateUrl: './import-field-modal.component.html',
  styleUrls: ['./import-field-modal.component.scss'],
})
export class ImportFieldModalComponent extends UnsubscribeComponent {
  /** Import field form group */
  public importFieldForm!: FormControl;
  /** All fields */
  public fields: any[] = [];
  /** Loading state */
  public loading = true;

  /**
   * Channel component, act as modal.
   * Used for both edition and addition of channels.
   *
   * @param data Injected dialog data
   * @param apollo Used for loading the resources.
   * @param snackBar Service used to show a snackbar.
   * @param dialogRef Dialog ref
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    public dialogRef: DialogRef<ImportFieldModalComponent>
  ) {
    super();

    // Get the resource and the core form linked
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id: this.data.resourceId,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data, loading }) => {
          if (data.resource) {
            const structure = data.resource.coreForm?.structure;
            const survey = new Model(structure);
            this.fields =
              survey
                ?.getAllQuestions()
                .filter((q) => q.unique)
                .map((q) => q.name) ?? [];
            this.fields.push('incrementalId');
            this.importFieldForm = new FormControl(
              data.resource.importField,
              Validators.required
            );
            this.loading = loading;
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.dialogRef.close();
        },
      });
  }
}
