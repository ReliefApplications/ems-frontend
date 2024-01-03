import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionResourceAvailableFieldsModel } from './resource-available-fields.model';
import { Dialog } from '@angular/cdk/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { GET_SHORT_RESOURCE_BY_ID } from './graphql/queries';
import { Subject, takeUntil } from 'rxjs';
import { ButtonModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ResourceQueryResponse } from '../../../models/resource.model';

/**
 * Resource available fields component for survey creator
 */
@Component({
  selector: 'shared-resource-available-fields',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslateModule],
  template: `
    <ui-button
      style="display: flex !important"
      class="flex-col"
      category="secondary"
      (click)="openResourceFieldsModal()"
      [loading]="loading"
    >
      {{
        'components.formBuilder.propertyGrid.resource.availableGridFields'
          | translate
      }}</ui-button
    >
  `,
})
export class ResourceAvailableFieldsComponent
  extends QuestionAngular<QuestionResourceAvailableFieldsModel>
  implements OnDestroy
{
  /** Destroy subject */
  private destroy$: Subject<void> = new Subject<void>();

  /** Loading state of resource for opening dialog */
  public loading = false;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param {ChangeDetectorRef} changeDetectorRef - Angular - This is angular change detector ref of the component instance needed for the survey AngularQuestion class
   * @param {ViewContainerRef} viewContainerRef - Angular - This is angular view container ref of the component instance needed for the survey AngularQuestion class
   * @param {UntypedFormBuilder} fb - Angular - Form builder utilities
   * @param {Dialog} dialog - Angular CDK - This is the Dialog service that is used to handle cdk dialogs
   * @param {Apollo} apollo - Apollo - This is the Apollo service that we'll use to make our GraphQL queries.
   * @param {NgZone} ngZone - Angular - This is angular injectable service for executing work inside or outside of the Angular zone.
   */
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    viewContainerRef: ViewContainerRef,
    private fb: UntypedFormBuilder,
    private dialog: Dialog,
    private apollo: Apollo,
    private ngZone: NgZone
  ) {
    super(changeDetectorRef, viewContainerRef);
  }

  /**
   * Open a modal for the selected resource with all the available fields
   */
  async openResourceFieldsModal() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const { ConfigDisplayGridFieldsModalComponent } = await import(
      './config-display-grid-fields-modal/config-display-grid-fields-modal.component'
    );
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_SHORT_RESOURCE_BY_ID,
        variables: {
          id: this.model.obj.resource,
        },
      })
      .subscribe({
        next: ({ data }) => {
          this.loading = false;
          if (data.resource && data.resource.name) {
            const nameTrimmed = data.resource.name
              .replace(/\s/g, '')
              .toLowerCase();
            // Run dialog opening inside the current angular zone in order to keep the change detection correctly synchronized
            this.ngZone.run(() => {
              const dialogRef = this.dialog.open(
                ConfigDisplayGridFieldsModalComponent,
                {
                  data: {
                    form: !this.model.obj.gridFieldsSettings
                      ? null
                      : this.convertFromRawToFormGroup(
                          this.model.obj.gridFieldsSettings
                        ),
                    resourceName: nameTrimmed,
                  },
                }
              );
              dialogRef.closed
                .pipe(takeUntil(this.destroy$))
                .subscribe((res: any) => {
                  if (res && res.value.fields) {
                    this.model.obj.gridFieldsSettings = res.getRawValue();
                  }
                });
            });
          }
        },
        error: () => (this.loading = false),
      });
  }

  /**
   * Set a form group with the given grid settings values
   *
   * @param gridSettingsRaw Grid settings
   * @returns  Form containing grid settings values
   */
  convertFromRawToFormGroup(gridSettingsRaw: any): UntypedFormGroup | null {
    if (!gridSettingsRaw.fields) {
      return null;
    }
    const auxForm = this.fb.group(gridSettingsRaw);
    auxForm.controls.fields.setValue(gridSettingsRaw.fields);
    return auxForm;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
