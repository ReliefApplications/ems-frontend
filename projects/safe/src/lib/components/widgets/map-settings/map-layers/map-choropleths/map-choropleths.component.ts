import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { clorophletForm } from '../../map-forms';
import { MapClorophletComponent } from '../map-choropleth/map-choropleth.component';

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

  @Input() selectedFields: any[] = [];
  @Input() formatedSelectedFields: any[] = [];
  @Input() query: any;

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
        fields: this.selectedFields,
        formatedFields: this.formatedSelectedFields,
        query: this.query,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
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
