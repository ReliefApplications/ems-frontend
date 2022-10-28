import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Apollo } from 'apollo-angular';
import { isArray } from 'lodash';
import get from 'lodash/get';
import { Group, Role } from '../../../models/user.model';
import { SafeRestService } from '../../../services/rest/rest.service';
import { getFilterGroupDisplay } from '../../../utils/filter/filter-display.helper';
import { createFilterGroup } from '../../query-builder/query-builder-forms';
import { GetGroupsQueryResponse, GET_GROUPS } from '../graphql/queries';
import { EditRoleAutoAssignmentModalComponent } from './edit-role-auto-assignment-modal/edit-role-auto-assignment-modal.component';

/**
 * Component for Auto assignment of role
 */
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

  private fields: any[] = [];
  private groups: Group[] = [];

  /**
   * Component for Auto assignment of role
   *
   * @param fb Angular form builder
   * @param apollo Apollo service
   * @param dialog Material dialog
   * @param translate Angular translate service
   * @param restService Safe REST service
   */
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private dialog: MatDialog,
    private translate: TranslateService,
    private restService: SafeRestService
  ) {}

  ngOnInit(): void {
    this.formArray = this.fb.array(
      get(this.role, 'autoAssignment', []).map((x: CompositeFilterDescriptor) =>
        createFilterGroup(x)
      )
    );
    this.rules.data = this.formArray.value;
    this.formArray.valueChanges.subscribe((value) => {
      this.rules.data = value;
    });
    this.apollo
      .query<GetGroupsQueryResponse>({
        query: GET_GROUPS,
      })
      .subscribe((res) => {
        if (res.data.groups) {
          this.groups = res.data.groups;
          this.fields.push({
            text: 'User Groups',
            name: '{{groups}}',
            editor: 'select',
            multiSelect: true,
            options: this.groups.map((group) => ({
              text: group.title,
              value: group.id,
            })),
            filter: {
              operators: ['eq', 'contains'],
            },
          });
        }
      });

    const url = '/permissions/attributes';
    this.restService.get(url).subscribe((res: any) => {
      if (isArray(res)) {
        res.forEach((attr: { value: string; text: string }) => {
          this.fields.push({
            text: attr.text,
            name: `{{attributes.${attr.value}}}`,
            filter: {
              operators: ['eq'],
            },
            editor: 'text',
          });
        });
      }
    });
  }

  /**
   * Get display of assignment rule
   *
   * @param rule assignment rule
   * @returns assignment rule display
   */
  getRuleDisplay(rule: CompositeFilterDescriptor): string {
    return getFilterGroupDisplay(this.fields, rule, this.translate);
  }

  /**
   * Add new assignment rule
   */
  addRule(): void {
    const formGroup = createFilterGroup(null);
    const dialogRef = this.dialog.open(EditRoleAutoAssignmentModalComponent, {
      data: {
        formGroup,
        fields: this.fields,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.edit.emit({
          autoAssignment: {
            add: value,
          },
        });
        this.formArray.push(createFilterGroup(value));
      }
    });
  }

  /**
   * Delete assignment rule
   *
   * @param index rule index
   */
  deleteRule(index: number): void {
    this.edit.emit({
      autoAssignment: {
        remove: this.formArray.at(index).value,
      },
    });
    this.formArray.removeAt(index);
  }

  /**
   * Edit assignment rule in modal
   *
   * @param index rule index
   */
  editRule(index: number): void {
    const formGroup = createFilterGroup(this.formArray.at(index).value);
    const dialogRef = this.dialog.open(EditRoleAutoAssignmentModalComponent, {
      data: {
        formGroup,
        fields: this.fields,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.edit.emit({
          autoAssignment: {
            add: value,
            remove: this.formArray.at(index).value,
          },
        });
        this.formArray.removeAt(index);
        this.formArray.insert(index, createFilterGroup(value));
      }
    });
  }
}
