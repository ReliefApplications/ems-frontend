import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Mapping } from '../../../models/setting.model';
import { createFormGroup } from '../mapping-forms';

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
  selector: 'safe-mapping-modal',
  templateUrl: './mapping-modal.component.html',
  styleUrls: ['./mapping-modal.component.scss'],
})
export class SafeMappingModalComponent implements OnInit {
  public form: FormGroup = new FormGroup({});
  public isNew = false;
  /**
   * Constructor of the SafeMappingModalComponent.
   *
   * @param data Data injected into this modal.
   * @param dialogRef Dialog reference for this modal.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MappingDialogData,
    private dialogRef: MatDialogRef<SafeMappingModalComponent>
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
