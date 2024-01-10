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
  SelectMenuModule,
  TooltipModule,
} from '@oort-front/ui';
import { ButtonModule } from '@oort-front/ui';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { GET_RESOURCE_LAYOUTS, GET_FORM_LAYOUTS } from './graphql/queries';
import { get } from 'lodash';
import { Layout } from '../../../models/layout.model';

/**
 * Data needed for the dialog, should contain a layouts array, a form and a resource
 */
interface DialogData {
  form?: Form;
  resource?: Resource;
  useQueryRef?: boolean;
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
    SelectMenuModule,
  ],
  selector: 'shared-add-layout-modal',
  templateUrl: './add-layout-modal.component.html',
  styleUrls: ['./add-layout-modal.component.scss'],
})
export class AddLayoutModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /**
   * Form
   */
  private form?: Form;
  /**
   * Resource
   */
  public resource?: Resource;
  /**
   * Next step
   */
  public nextStep = false;
  /**
   * Query ref
   */
  public queryRef!:
    | QueryRef<ResourceQueryResponse>
    | QueryRef<FormQueryResponse>
    | null;
  /**
   * Selected layout control
   */
  public selectedLayoutControl = new UntypedFormControl('');
  /**
   * Layouts list when not using graphql-select
   */
  public layouts?: Layout[];

  /** Reference to graphql select for layout */
  @ViewChild(GraphQLSelectComponent)
  layoutSelect?: GraphQLSelectComponent;

  /** @returns if has layouts */
  get hasLayouts(): boolean {
    return (
      get(this.form ? this.form : this.resource, 'layouts.totalCount', 0) > 0
    );
  }

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
    this.form = data.form;
    this.resource = data.resource;
  }

  ngOnInit() {
    if (this.data.useQueryRef !== false) {
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
    } else {
      this.layouts = this.resource?.layouts?.edges.map(
        (edge: any) => edge.node
      );
    }

    this.selectedLayoutControl.valueChanges.subscribe((value) => {
      if (value) {
        if (this.data.useQueryRef) {
          this.dialogRef.close(
            this.layoutSelect?.elements.getValue().find((x) => x.id === value)
          );
        } else {
          this.dialogRef.close(
            this.layouts?.find((x) => x.id === value) as any
          );
        }
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
