import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group, RoleRule } from '../../../../models/user.model';
import { PositionAttributeCategory } from '../../../../models/position-attribute-category.model';
import { FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { GetGroupsQueryResponse, GET_GROUPS } from '../../graphql/queries';
import { createFilterGroup } from '../../../query-builder/query-builder-forms';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep, isEqual } from 'lodash';

/** Modal for adding & editing a role rule */
@Component({
  selector: 'safe-add-role-rule',
  templateUrl: './add-role-rule.component.html',
  styleUrls: ['./add-role-rule.component.scss'],
})
export class SafeAddRoleRuleComponent implements OnInit {
  public loading = true;
  public ruleForm!: FormGroup;
  public fields: any[] = [];
  public groupsMeta: any;

  private initialForm!: FormGroup;
  private groups: Group[] = [];
  private attributes: PositionAttributeCategory[] = [];
  /**
   * Modal for adding & editing a role rule
   *
   * @param apollo Apollo shared service
   * @param translate Angular translate service
   * @param dialogRef Dialog ref
   * @param data Data to be used in the modal
   * @param data.rule Initial value for the rule
   * @param data.positionAttributeCategories available position attribute categories
   */
  constructor(
    private apollo: Apollo,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<SafeAddRoleRuleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      rule: RoleRule;
      positionAttributeCategories?: PositionAttributeCategory[];
    }
  ) {
    this.attributes = data.positionAttributeCategories || [];
  }

  ngOnInit(): void {
    console.log(this.data.rule);
    this.ruleForm = createFilterGroup(this.ruleToFilter(this.data.rule));
    this.initialForm = cloneDeep(this.ruleForm);
    this.apollo
      .query<GetGroupsQueryResponse>({
        query: GET_GROUPS,
      })
      .subscribe(({ data }) => {
        this.groups = data.groups;
        this.setFieldsAndMeta();
        this.loading = data.loading;
      });
  }

  /**
   * Transforms a rule into a filter format
   *
   * @param rule Rule to transform
   * @returns Filter format of rule
   */
  ruleToFilter(rule: RoleRule): any {
    return rule;
    // return {
    //   logic: rule.logic,
    //   filters: rule.rules.map((x) => {
    //     if ('rules' in x) return this.ruleToFilter(x);
    //     else {
    //       if (x.groups)
    //         return {
    //           field: this.translate.instant('common.group.one'),
    //           operator: x.groups.operator,
    //           value: x.groups.value
    //         };
    //       else if (x.attribute)
    //         return {
    //           field: x.attribute.category.title,
    //           operator: x.attribute.operator,
    //           value: x.attribute.value,
    //         };
    //       else return null;
    //     }
    //   }),
    // };
  }

  /**
   * Transforms a filter into a rule format
   *
   * @param filter Filter to transform
   * @returns Rule format of rule
   */
  private filterToRule(filter: any): RoleRule {
    return {
      logic: filter.logic,
      rules: filter.filters.map((x: any) => {
        if ('filters' in x) return this.filterToRule(x);
        return {
          group: x.value.group,
        };
        // return {
        //   attribute: {
        //     category: this.attributes.find((a) => a.title === x.field),
        //     operator: x.operator,
        //     value: x.value,
        //   },
        // };
      }),
    };
  }

  /** Sets up fields from groups and attributes */
  private setFieldsAndMeta(): void {
    const fieldTitle = this.translate.instant('common.group.one');
    // Group fields
    this.fields.push({
      name: fieldTitle,
      type: {
        name: 'Group',
        kind: 'SCALAR',
      },
    });
    // Group meta
    this.groupsMeta = {
      [fieldTitle]: {
        name: fieldTitle,
        type: 'dropdown',
        choices: this.groups.map((g) => ({
          value: { group: g.id },
          text: g.title,
        })),
      },
    };

    // Attributes fields
    // this.fields.push(
    //   ...this.attributes.map((attribute) => ({
    //     name: attribute.title,
    //     type: {
    //       name: 'String',
    //       kind: 'SCALAR',
    //     },
    //   }))
    // );
  }

  /** Handles save button click */
  public onSave(): void {
    console.log(this.ruleForm.value);
    this.dialogRef.close();
    // if (isEqual(this.ruleForm.value, this.initialForm.value))
    //   this.dialogRef.close();
    // else {
    //   // converting back to RoleRule format
    //   // const rule = this.filterToRule(this.ruleForm.value);
    //   console.log(this.ruleForm.value);
    //   this.dialogRef.close(rule);
    // }
  }
}
