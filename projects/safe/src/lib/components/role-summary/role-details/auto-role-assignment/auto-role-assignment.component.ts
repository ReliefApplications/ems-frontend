import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { Application } from '../../../../models/application.model';
import { RoleRule, Role } from '../../../../models/user.model';

/** Auto role assignment section component of Role Summary. */
@Component({
  selector: 'safe-auto-role-assignment',
  templateUrl: './auto-role-assignment.component.html',
  styleUrls: ['./auto-role-assignment.component.scss'],
})
export class AutoRoleAssignmentComponent implements OnInit {
  @Input() application!: Application;
  @Input() role!: Role;
  @Input() loading = true;

  public rules = new MatTableDataSource<RoleRule>([]);
  public displayedColumns: string[] = ['filter', 'actions'];

  /**
   * Auto role assignment section component of Role Summary.
   *
   * @param apollo Apollo service
   * @param translate Translate service
   */
  constructor(private apollo: Apollo, private translate: TranslateService) {}

  ngOnInit(): void {
    this.rules.data = this.role.rules || [];
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
              'components.role.summary.autoRoleAssignment.userInGroup',
              { name: rule.group.title }
            )}`
          );
        } else if (rule.attribute) {
          rulesStr.push(
            `${rule.attribute.category?.title} ${this.translate
              .instant('kendo.grid.filterEqOperator')
              .toLowerCase()} ${rule.attribute.value}`.trim()
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
   * Removes a rule from the role rules list.
   *
   * @param r Rule to be deleted
   */
  onDeleteRule(r: RoleRule): void {
    const index = this.rules.data.indexOf(r);
    this.rules.data.splice(index, 1);
  }
}
