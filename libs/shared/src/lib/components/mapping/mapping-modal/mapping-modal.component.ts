import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { createFormGroup, Mapping } from '../mapping-forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuModule, ButtonModule, FormWrapperModule } from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';

/**
 * Interface for the data injected into the modal.
 */
interface MappingDialogData {
  mapping?: Mapping;
}

/**
 * Modal component to Create/Edit a mapping row.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    IconModule,
    FormWrapperModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
  ],
  selector: 'shared-mapping-modal',
  templateUrl: './mapping-modal.component.html',
  styleUrls: ['./mapping-modal.component.scss'],
})
export class MappingModalComponent implements OnInit {
  public form: UntypedFormGroup = new UntypedFormGroup({});
  public isNew = false;

  /**
   * Constructor of the MappingModalComponent.
   *
   * @param data Data injected into this modal.
   * @param dialogRef Dialog reference for this modal.
   */
  constructor(
    @Inject(DIALOG_DATA) public data: MappingDialogData,
    private dialogRef: DialogRef<MappingModalComponent>
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.mapping) {
      this.form = createFormGroup(this.data.mapping);
    } else {
      this.form = createFormGroup(null);
      this.isNew = true;
    }
  }

  /** Close the modal without sending any data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
