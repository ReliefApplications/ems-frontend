import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
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
import { SafeGraphQLSelectComponent } from '../../graphql-select/graphql-select.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SafeModalModule } from '../../ui/modal/modal.module';
import { SafeGraphQLSelectModule } from '../../graphql-select/graphql-select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, Variant, Category } from '@oort-front/ui';

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
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    SafeButtonModule,
    SafeModalModule,
    SafeGraphQLSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  selector: 'safe-add-layout-modal',
  templateUrl: './add-layout-modal.component.html',
  styleUrls: ['./add-layout-modal.component.scss'],
})
export class AddLayoutModalComponent implements OnInit {
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
  @ViewChild(SafeGraphQLSelectComponent)
  layoutSelect?: SafeGraphQLSelectComponent;

  // === UI VARIANT AND CATEGORY ===
  public variant = Variant;
  public category = Category;

  /**
   * Add layout modal component.
   *
   * @param dialogRef Material dialog reference
   * @param dialog Material dialog instance
   * @param data Data used by the modal
   * @param gridLayoutService Grid layout service
   * @param apollo Apollo service
   */
  constructor(
    private dialogRef: MatDialogRef<AddLayoutModalComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private gridLayoutService: SafeGridLayoutService,
    private apollo: Apollo
  ) {
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
    dialogRef.afterClosed().subscribe((layout) => {
      if (layout) {
        this.gridLayoutService
          .addLayout(layout, this.resource?.id, this.form?.id)
          .subscribe(({ data }) => {
            if (data?.addLayout) {
              this.dialogRef.close(data.addLayout);
            } else {
              this.dialogRef.close();
            }
          });
      }
    });
  }
}
