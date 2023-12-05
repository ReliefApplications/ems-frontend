import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormArray, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Apollo } from 'apollo-angular';
import { isArray } from 'lodash';
import get from 'lodash/get';
import { Group, GroupsQueryResponse, Role } from '../../../models/user.model';
import { RestService } from '../../../services/rest/rest.service';
import { getFilterGroupDisplay } from '../../../utils/filter/filter-display.helper';
import { createFilterGroup } from '../../query-builder/query-builder-forms';
import { GET_GROUPS } from '../graphql/queries';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';

/**
 * Component for Auto assignment of role
 */
@Component({
  selector: 'shared-role-auto-assignment',
  templateUrl: './role-auto-assignment.component.html',
  styleUrls: ['./role-auto-assignment.component.scss'],
})
export class RoleAutoAssignmentComponent
  extends UnsubscribeComponent
  implements OnInit
{
  @Input() role!: Role;
  public formArray!: UntypedFormArray;
  @Output() edit = new EventEmitter();

  /** Setter for the loading state */
  @Input() set loading(loading: boolean) {
    if (loading) {
      this.formArray?.disable();
    } else {
      this.formArray?.enable();
    }
  }

  public rules = new Array<CompositeFilterDescriptor>();
  public displayedColumns: string[] = ['filter', 'actions'];

  private fields: any[] = [];
  private groups: Group[] = [];

  /**
   * Component for Auto assignment of role
   *
   * @param fb Angular form builder
   * @param apollo Apollo service
   * @param dialog Dialog
   * @param translate Angular translate service
   * @param restService  REST service
   */
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private dialog: Dialog,
    private translate: TranslateService,
    private restService: RestService
  ) {
    super();
  }

  ngOnInit(): void {
    this.formArray = this.fb.array(
      get(this.role, 'autoAssignment', []).map((x: CompositeFilterDescriptor) =>
        createFilterGroup(x)
      )
    );
    this.rules = this.formArray.value;
    this.formArray.valueChanges.subscribe((value) => {
      this.rules = value;
    });
    this.apollo
      .query<GroupsQueryResponse>({
        query: GET_GROUPS,
      })
      .subscribe(({ data }) => {
        if (data.groups) {
          this.groups = data.groups;
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
  async addRule(): Promise<void> {
    const formGroup = createFilterGroup(null);
    const { EditRoleAutoAssignmentModalComponent } = await import(
      './edit-role-auto-assignment-modal/edit-role-auto-assignment-modal.component'
    );
    const dialogRef = this.dialog.open(EditRoleAutoAssignmentModalComponent, {
      data: {
        formGroup,
        fields: this.fields,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
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
  async editRule(index: number): Promise<void> {
    const formGroup = createFilterGroup(this.formArray.at(index).value);
    const { EditRoleAutoAssignmentModalComponent } = await import(
      './edit-role-auto-assignment-modal/edit-role-auto-assignment-modal.component'
    );
    const dialogRef = this.dialog.open(EditRoleAutoAssignmentModalComponent, {
      data: {
        formGroup,
        fields: this.fields,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
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
