import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { SafeGridLayoutService } from '../../../services/grid-layout/grid-layout.service';
import { Form } from '../../../models/form.model';
import { Resource } from '../../../models/resource.model';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  GetResourceLayoutsResponse,
  GET_RESOURCE_LAYOUTS,
  GetFormLayoutsResponse,
  GET_FORM_LAYOUTS,
} from './graphql/queries';
import { UntypedFormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  DialogModule,
  FormWrapperModule,
  GraphQLSelectComponent,
  GraphQLSelectModule,
} from '@oort-front/ui';
import { ButtonModule } from '@oort-front/ui';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';

/**
 * Data needed for the dialog, should contain a layouts array, a form and a resource
 */
interface DialogData {
  hasLayouts: boolean;
  form?: Form;
  resource?: Resource;
}

/**
 * Add a layout modal.
 * Modal is then added to the grid, and to the related form / resource if new.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DialogModule,
    GraphQLSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    FormWrapperModule,
  ],
  selector: 'safe-add-layout-modal',
  templateUrl: './add-layout-modal.component.html',
  styleUrls: ['./add-layout-modal.component.scss'],
})
export class AddLayoutModalComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  private form?: Form;
  public resource?: Resource;
  public hasLayouts = false;
  public nextStep = false;
  public queryRef!:
    | QueryRef<GetResourceLayoutsResponse>
    | QueryRef<GetFormLayoutsResponse>
    | null;
  public selectedLayoutControl = new UntypedFormControl('');

  /** Reference to graphql select for layout */
  @ViewChild(GraphQLSelectComponent)
  layoutSelect?: GraphQLSelectComponent;

  /**
   * Add layout modal component.
   *
   * @param dialogRef Dialog reference
   * @param dialog Dialog instance
   * @param data Data used by the modal
   * @param gridLayoutService Grid layout service
   * @param apollo Apollo service
   */
  constructor(
    private dialogRef: DialogRef<AddLayoutModalComponent>,
    private dialog: Dialog,
    @Inject(DIALOG_DATA) public data: DialogData,
    private gridLayoutService: SafeGridLayoutService,
    private apollo: Apollo
  ) {
    super();
    this.hasLayouts = data.hasLayouts;
    this.form = data.form;
    this.resource = data.resource;
  }

  ngOnInit() {
    if (this.resource)
      this.queryRef = this.apollo.watchQuery<GetResourceLayoutsResponse>({
        query: GET_RESOURCE_LAYOUTS,
        variables: {
          resource: this.resource?.id,
        },
      });
    else if (this.form)
      this.queryRef = this.apollo.watchQuery<GetFormLayoutsResponse>({
        query: GET_FORM_LAYOUTS,
        variables: {
          form: this.form?.id,
        },
      });

    this.selectedLayoutControl.valueChanges.subscribe((value) => {
      if (value) {
        this.dialogRef.close(
          this.layoutSelect?.elements.getValue().find((x) => x.id === value)
        );
      }
    });
  }

  /**
   * Opens the panel to create a new layout.
   */
  public async onCreate(): Promise<void> {
    const { SafeEditLayoutModalComponent } = await import(
      '../edit-layout-modal/edit-layout-modal.component'
    );
    const dialogRef = this.dialog.open(SafeEditLayoutModalComponent, {
      disableClose: true,
      data: {
        queryName: this.resource?.queryName || this.form?.queryName,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((layout: any) => {
      if (layout) {
        this.gridLayoutService
          .addLayout(layout, this.resource?.id, this.form?.id)
          .subscribe(({ data }) => {
            if (data?.addLayout) {
              this.dialogRef.close(data.addLayout as any);
            } else {
              this.dialogRef.close();
            }
          });
      }
    });
  }
}
