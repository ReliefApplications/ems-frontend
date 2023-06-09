import { Component, Input } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { clorophletForm } from '../../map-forms';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';

/**
 * List of clorophlets in Map Settings
 */
@Component({
  selector: 'safe-map-clorophlets',
  templateUrl: './map-clorophlets.component.html',
  styleUrls: ['./map-clorophlets.component.scss'],
})
export class MapClorophletsComponent extends SafeUnsubscribeComponent {
  @Input() clorophlets!: UntypedFormArray;

  @Input() selectedFields: any[] = [];
  @Input() formattedSelectedFields: any[] = [];
  @Input() query: any;

  public tableColumns = ['name', 'actions'];

  /**
   * List of clorophlets in Map Settings
   *
   * @param dialog Dialog Service
   */
  constructor(private dialog: Dialog) {
    super();
  }

  /**
   * Adds a new clorophlet.
   */
  public addClorophlet(): void {
    this.clorophlets.push(clorophletForm());
    this.editClorophlet(this.clorophlets.length - 1);
  }

  /**
   * Open dialog to edit clorophlet at index.
   *
   * @param index index of clorophlet to edit.
   */
  public async editClorophlet(index: number): Promise<void> {
    const { MapClorophletComponent } = await import(
      '../map-clorophlet/map-clorophlet.component'
    );
    const dialogRef = this.dialog.open(MapClorophletComponent, {
      data: {
        value: this.clorophlets.at(index).value,
        fields: this.selectedFields,
        formattedFields: this.formattedSelectedFields,
        query: this.query,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.clorophlets.setControl(index, clorophletForm(value));
      }
    });
  }

  /**
   * Remove a clorophlet.
   *
   * @param index position of the clorophlet to delete.
   */
  public removeClorophlet(index: number): void {
    this.clorophlets.removeAt(index);
  }
}
