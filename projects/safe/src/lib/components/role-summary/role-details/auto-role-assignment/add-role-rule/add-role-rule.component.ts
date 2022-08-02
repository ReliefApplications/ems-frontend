import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group, RoleRule } from '../../../../../models/user.model';
import { PositionAttributeCategory } from '../../../../../models/position-attribute-category.model';
import { FormBuilder } from '@angular/forms';

/** Modal for adding & editing a role rule */
@Component({
  selector: 'safe-add-role-rule',
  templateUrl: './add-role-rule.component.html',
  styleUrls: ['./add-role-rule.component.scss'],
})
export class SafeAddRoleRuleComponent implements OnInit {
  groups: Group[] = [];
  attributes: PositionAttributeCategory[] = [];
  /**
   * Modal for adding & editing a role rule
   *
   * @param fb FormBuilder shared service
   * @param data Data to be used in the modal
   * @param data.rule Initial value for the rule
   */
  constructor(
    fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      rule: RoleRule;
    }
  ) {}

  ngOnInit(): void {}
}
