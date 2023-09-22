import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { GridLayoutService } from '../../../services/grid-layout/grid-layout.service';
import { Form, FormQueryResponse } from '../../../models/form.model';
import {
  Resource,
  ResourceQueryResponse,
} from '../../../models/resource.model';
import { Apollo, QueryRef } from 'apollo-angular';
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
  TooltipModule,
} from '@oort-front/ui';
import { ButtonModule } from '@oort-front/ui';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { GET_RESOURCE_LAYOUTS, GET_FORM_LAYOUTS } from './graphql/queries';

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
    TooltipModule,
  ],
  selector: 'shared-add-layout-modal',
  templateUrl: './add-layout-modal.component.html',
  styleUrls: ['./add-layout-modal.component.scss'],
})
export class AddLayoutModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  private form?: Form;
  public resource?: Resource;
  public hasLayouts = false;
  public nextStep = false;
  public queryRef!:
    | QueryRef<ResourceQueryResponse>
    | QueryRef<FormQueryResponse>
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
    private gridLayoutService: GridLayoutService,
    private apollo: Apollo
  ) {
    super();
    this.hasLayouts = data.hasLayouts;
    this.form = data.form;
    this.resource = data.resource;
  }

  ngOnInit() {
    if (this.resource)
      this.queryRef = this.apollo.watchQuery<ResourceQueryResponse>({
        query: GET_RESOURCE_LAYOUTS,
        variables: {
          resource: this.resource?.id,
        },
      });
    else if (this.form)
      this.queryRef = this.apollo.watchQuery<FormQueryResponse>({
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
    const { EditLayoutModalComponent } = await import(
      '../edit-layout-modal/edit-layout-modal.component'
    );
    const dialogRef = this.dialog.open(EditLayoutModalComponent, {
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
