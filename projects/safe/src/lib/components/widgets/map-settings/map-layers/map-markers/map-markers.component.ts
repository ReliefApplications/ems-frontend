import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { markerRuleForm } from '../../map-forms';

@Component({
  selector: 'safe-map-markers',
  templateUrl: './map-markers.component.html',
  styleUrls: ['./map-markers.component.scss'],
})
export class MapMarkersComponent implements OnInit {
  @Input() form!: FormGroup;

  @Input() selectedFields = [];

  get rules(): FormArray {
    return this.form.get('markerRules') as FormArray;
  }

  public tableColumns = ['label', 'actions'];

  /**
   * List of rules in Map Settings
   *
   * @param dialog Material Dialog Service
   */
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  /**
   * Adds a new rule.
   */
  public addRule(): void {
    this.rules.push(markerRuleForm());
    this.editRule(this.rules.length - 1);
  }

  /**
   * Open dialog to edit rule at index.
   *
   * @param index index of rule to edit.
   */
  public editRule(index: number): void {
    // const dialogRef = this.dialog.open(MapClorophletComponent, {
    //   data: {
    //     value: this.clorophlets.at(index).value,
    //   },
    // });
    // dialogRef.afterClosed().subscribe((value) => {
    //   if (value) {
    //     this.clorophlets.removeAt(index);
    //     this.clorophlets.insert(index, clorophletForm(value));
    //   }
    // });
  }

  /**
   * Remove a rule.
   *
   * @param index position of the rule to delete.
   */
  public removeRule(index: number): void {
    this.rules.removeAt(index);
  }
}
