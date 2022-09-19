import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Apollo } from 'apollo-angular';
import get from 'lodash/get';
import { Role } from '../../../models/user.model';
import { createFilterGroup } from '../../query-builder/query-builder-forms';

@Component({
  selector: 'safe-role-auto-assignment',
  templateUrl: './role-auto-assignment.component.html',
  styleUrls: ['./role-auto-assignment.component.scss'],
})
export class RoleAutoAssignmentComponent implements OnInit {
  @Input() role!: Role;
  public formArray!: FormArray;
  @Output() edit = new EventEmitter();
  /** Setter for the loading state */
  @Input() set loading(loading: boolean) {
    if (loading) {
      this.formArray?.disable();
    } else {
      this.formArray?.enable();
    }
  }

  public rules = new MatTableDataSource<CompositeFilterDescriptor>([]);
  public displayedColumns: string[] = ['filter', 'actions'];

  constructor(private fb: FormBuilder, private apollo: Apollo) {}

  ngOnInit(): void {
    this.formArray = this.fb.array(
      get(this.role, 'autoAssignment', []).map((x: CompositeFilterDescriptor) =>
        createFilterGroup(x)
      )
    );
    this.formArray.valueChanges.subscribe((value) => {
      this.rules.data = value;
    });
  }

  getRuleDisplay(rule: CompositeFilterDescriptor): string {
    console.log(rule);
    return 'ok';
  }

  addRule(): void {
    this.formArray.push(createFilterGroup(null));
  }

  deleteRule(index: number): void {
    this.formArray.removeAt(index);
  }

  editRule(index: number): void {
    console.log('edit');
  }
}
