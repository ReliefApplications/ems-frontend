import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { clorophletForm } from '../../map-forms';
import { MapClorophletComponent } from '../map-clorophlet/map-clorophlet.component';

/**
 * List of clorophlets in Map Settings
 */
@Component({
  selector: 'safe-map-clorophlets',
  templateUrl: './map-clorophlets.component.html',
  styleUrls: ['./map-clorophlets.component.scss'],
})
export class MapClorophletsComponent implements OnInit {
  @Input() clorophlets!: FormArray;

  public tableColumns = ['name', 'actions'];

  /**
   * List of clorophlets in Map Settings
   *
   * @param dialog Material Dialog Service
   */
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

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
  public editClorophlet(index: number): void {
    const dialogRef = this.dialog.open(MapClorophletComponent, {
      data: {
        value: this.clorophlets.at(index).value,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.clorophlets.removeAt(index);
        this.clorophlets.insert(index, clorophletForm(value));
        // this.clorophlets.at(index).patchValue(value);
        // this.clorophlets.at(index).setValue(value);
      }
    });
  }

  /**
   * Removes a clorophlets.
   *
   * @param index position of the clorophlet to delete.
   */
  public removeClorophlet(index: number): void {
    this.clorophlets.removeAt(index);
  }
}
