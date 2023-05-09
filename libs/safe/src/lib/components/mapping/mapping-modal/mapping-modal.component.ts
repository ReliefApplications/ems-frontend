import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { createFormGroup, Mapping } from '../mapping-forms';
import { CommonModule } from '@angular/common';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SafeModalModule } from '../../ui/modal/modal.module';

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
    MatTableModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SafeButtonModule,
    SafeModalModule,
  ],
  selector: 'safe-mapping-modal',
  templateUrl: './mapping-modal.component.html',
  styleUrls: ['./mapping-modal.component.scss'],
})
export class SafeMappingModalComponent implements OnInit {
  public form: UntypedFormGroup = new UntypedFormGroup({});
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
