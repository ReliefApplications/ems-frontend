import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TabsModule,
  DialogModule,
  ButtonModule,
  TooltipModule,
  SelectMenuModule,
  FormWrapperModule,
  IconModule,
  ToggleModule,
  AlertModule,
} from '@oort-front/ui';
import { GridType } from 'angular-gridster2';
import { CommonModule } from '@angular/common';

/**
 * Represents the data passed to the dialog component.
 */
interface DialogData {
  formGroup: FormGroup;
}

/**
 * Edition of tab grid options, in modal.
 */
@Component({
  selector: 'shared-tab-grid-settings-modal',
  templateUrl: './tab-grid-settings-modal.component.html',
  styleUrls: ['./tab-grid-settings-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    DialogModule,
    IconModule,
    ButtonModule,
    TooltipModule,
    SelectMenuModule,
    FormWrapperModule,
    ToggleModule,
    AlertModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class TabGridSettingsModalComponent {
  /** Form group */
  public formGroup!: FormGroup;
  /** Grid type */
  public gridType = GridType;
  /** Default grid options */
  public defaultGridOptions = {
    minCols: 8,
    fixedRowHeight: 200,
    margin: 10,
  };

  /**
   * Edition of tab grid options, in modal.
   *
   * @param data - Data passed to dialog.
   */
  constructor(@Inject(DIALOG_DATA) public data: DialogData) {
    this.formGroup = data.formGroup;
  }
}
