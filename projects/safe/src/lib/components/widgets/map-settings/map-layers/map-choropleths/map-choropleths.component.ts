import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { choroplethForm } from '../../map-forms';
import { MapChoroplethComponent } from '../map-choropleth/map-choropleth.component';

/**
 * List of choropleth layers in Map Settings
 */
@Component({
  selector: 'safe-map-choropleths',
  templateUrl: './map-choropleths.component.html',
  styleUrls: ['./map-choropleths.component.scss'],
})
export class MapChoroplethsComponent implements OnInit {
  @Input() choropleths!: FormArray;

  @Input() selectedFields: any[] = [];
  @Input() formatedSelectedFields: any[] = [];
  @Input() query: any;

  public tableColumns = ['name', 'actions'];

  /**
   * List of choropleth layers in Map Settings
   *
   * @param dialog Material Dialog Service
   */
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  /**
   * Adds a new choropleth layer.
   */
  public addChoropleth(): void {
    this.choropleths.push(choroplethForm());
    this.editChoropleth(this.choropleths.length - 1);
  }

  /**
   * Open dialog to edit choropleth layer at index.
   *
   * @param index index of choropleth layer to edit.
   */
  public editChoropleth(index: number): void {
    const dialogRef = this.dialog.open(MapChoroplethComponent, {
      data: {
        value: this.choropleths.at(index).value,
        fields: this.selectedFields,
        formatedFields: this.formatedSelectedFields,
        query: this.query,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.choropleths.setControl(index, choroplethForm(value));
      }
    });
  }

  /**
   * Remove a choropleth layer.
   *
   * @param index position of the choropleth layer to delete.
   */
  public removeChoropleth(index: number): void {
    this.choropleths.removeAt(index);
  }
}
