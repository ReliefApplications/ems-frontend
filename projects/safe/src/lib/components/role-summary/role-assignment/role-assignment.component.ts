import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { isEqual } from 'lodash';
import { RoleRule, Role } from '../../../models/user.model';
import {
  EditRoleRulesMutationResponse,
  EDIT_ROLE_RULES,
} from '../graphql/mutations';
import { SafeAddRoleRuleComponent } from './add-role-rule/add-role-rule.component';

/** New rule filter */
const NEW_RULE: RoleRule = {
  logic: 'and',
  rules: [],
};

/**
 * Assignment tab of Role Summary
 */
@Component({
  selector: 'safe-role-assignment',
  templateUrl: './role-assignment.component.html',
  styleUrls: ['./role-assignment.component.scss'],
})
export class RoleAssignmentComponent implements OnInit {
  @Input() role!: Role;
  @Input() loading = false;

  public rules = new MatTableDataSource<RoleRule>([]);
  public displayedColumns: string[] = ['filter', 'actions'];

  private opMap: {
    [key: string]: string;
  } = {
    eq: this.translate.instant('kendo.grid.filterEqOperator'),
    neq: this.translate.instant('kendo.grid.filterNotEqOperator'),
    contains: this.translate.instant('kendo.grid.filterContainsOperator'),
    doesnotcontain: this.translate.instant(
      'kendo.grid.filterNotContainsOperator'
    ),
    startswith: this.translate.instant('kendo.grid.filterStartsWithOperator'),
    endswith: this.translate.instant('kendo.grid.filterEndsWithOperator'),
    isnull: this.translate.instant('kendo.grid.filterIsNullOperator'),
    isnotnull: this.translate.instant('kendo.grid.filterIsNotNullOperator'),
    isempty: this.translate.instant('kendo.grid.filterIsEmptyOperator'),
    isnotempty: this.translate.instant('kendo.grid.filterIsNotEmptyOperator'),
  };

  /**
   * Auto role assignment section component of Role Summary.
   *
   * @param apollo Apollo service
   * @param translate Translate service
   * @param dialog Shared dialog service
   */
  constructor(
    private apollo: Apollo,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.rules.data = this.role.rules || [];
  }

  @Output() edit = new EventEmitter();

  /**
   * Emit an event with new role value
   *
   * @param value new role value
   */
  onUpdate(value: any): void {
    this.edit.emit(value);
  }

  /**
   * Gets string representation of a rule.
   *
   * @param r Rule to get string representation of
   * @returns String representation of rule
   */
  getRuleString(r: RoleRule): string {
    if (!r || !r.rules) return '';
    const rulesStr: string[] = [];
    r.rules.forEach((rule) => {
      // nested filter
      if ('rules' in rule) {
        rulesStr.push(`(${this.getRuleString(rule)})`);
      } else {
        if (rule.group) {
          rulesStr.push(
            `${this.translate.instant(
              'components.role.summary.automaticAssignment.userInGroup',
              { name: rule.group.title }
            )}`
          );
        } else if (rule.attribute) {
          rulesStr.push(
            `${rule.attribute.category?.title} ${this.opMap[
              rule.attribute.operator
            ].toLowerCase()} ${rule.attribute.value}`.trim()
          );
        }
      }
    });
    if (rulesStr.length)
      return rulesStr.join(
        ` ${(r.logic === 'and'
          ? this.translate.instant('kendo.grid.filterAndLogic')
          : this.translate.instant('kendo.grid.filterOrLogic')
        ).toLowerCase()} `
      );
    else return '';
  }

  /**
   * Opens modal to add or edit a rule to the role rules list.
   *
   * @param r Rule to be edited
   */
  handleAddRule(r?: RoleRule) {
    const dialogRef = this.dialog.open(SafeAddRoleRuleComponent, {
      data: {
        rule: r || NEW_RULE,
        // positionAttributeCategories:
        //   this.application.positionAttributeCategories,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value && !isEqual(value, r)) {
        // if editing, add the new version of the rule and remove the old one
        const changedRules = Object.assign(
          {
            add: [value],
          },
          r && { remove: [r] }
        );
        this.loading = true;
        this.apollo
          .mutate<EditRoleRulesMutationResponse>({
            mutation: EDIT_ROLE_RULES,
            variables: {
              id: this.role.id,
              rules: changedRules,
            },
          })
          .subscribe((res) => {
            this.rules.data = res.data?.editRole.rules || [];
            this.loading = res.loading;
          });
      }
    });
  }

  /**
   * Removes rule from role rules list.
   *
   * @param r Rule to be deleted
   */
  public handleRemoveRule(r: RoleRule) {
    this.loading = true;
    this.apollo
      .mutate<EditRoleRulesMutationResponse>({
        mutation: EDIT_ROLE_RULES,
        variables: {
          id: this.role.id,
          rules: {
            remove: [r],
          },
        },
      })
      .subscribe((res) => {
        this.rules.data = res.data?.editRole.rules || [];
        this.loading = res.loading;
      });
  }
}
