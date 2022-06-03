import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { SafeGridLayoutService } from '../../../../services/grid-layout.service';
import { Form } from '../../../../models/form.model';
import { Layout } from '../../../../models/layout.model';
import { Resource } from '../../../../models/resource.model';
import { SafeLayoutModalComponent } from '../../../layout-modal/layout-modal.component';

interface DialogData {
  layouts: Layout[];
  form?: Form;
  resource?: Resource;
}

/**
 * Add a layout modal.
 * Modal is then added to the grid, and to the related form / resource if new.
 */
@Component({
  selector: 'safe-add-layout',
  templateUrl: './add-layout.component.html',
  styleUrls: ['./add-layout.component.scss'],
})
export class AddLayoutComponent implements OnInit {
  private form?: Form;
  private resource?: Resource;
  public layouts: Layout[] = [];
  public nextStep = false;

  constructor(
    private dialogRef: MatDialogRef<AddLayoutComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private gridLayoutService: SafeGridLayoutService
  ) {
    this.layouts = data.layouts;
    this.form = data.form;
    this.resource = data.resource;
  }

  ngOnInit(): void {}

  /**
   * Opens the panel to create a new layout.
   */
  public onCreate(): void {
    const dialogRef = this.dialog.open(SafeLayoutModalComponent, {
      disableClose: true,
      data: {
        queryName: this.resource?.queryName || this.form?.queryName,
      },
      position: {
        bottom: '0',
        right: '0',
      },
      panelClass: 'tile-settings-dialog',
    });
    dialogRef.afterClosed().subscribe((layout) => {
      if (layout) {
        this.gridLayoutService
          .addLayout(layout, this.resource?.id, this.form?.id)
          .subscribe((res) => {
            if (res.data?.addLayout) {
              this.dialogRef.close(res.data.addLayout);
            } else {
              this.dialogRef.close();
            }
          });
      }
    });
  }

  /**
   * Selects an existing layout.
   *
   * @param choice layout choice.
   */
  public onSelect(choice: MatSelectChange): void {
    this.dialogRef.close(choice.value);
  }
}
