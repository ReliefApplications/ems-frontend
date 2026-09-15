import { Component, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Apollo } from 'apollo-angular';
import get from 'lodash/get';
import { takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import {
  EditResourceMutationResponse,
  Resource,
  UnsubscribeComponent,
  UniquenessRule,
} from '@oort-front/shared';
import { EDIT_RESOURCE } from '../graphql/mutations';

/**
 * Validation tab of resource page. Lists the scoped uniqueness rules
 * configured on the resource: one or more fields that must be unique
 * (alone, or in combination) across all records of the resource,
 * optionally restricted to records matching a condition or checked as a
 * date-range overlap, and whether a violation should block saving or only
 * warn the user.
 */
@Component({
  selector: 'app-validation-tab',
  templateUrl: './validation-tab.component.html',
  styleUrls: ['./validation-tab.component.scss'],
})
export class ValidationTabComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Resource */
  public resource!: Resource;
  /** Uniqueness rules of the resource */
  public rules: UniquenessRule[] = [];
  /** Columns to display */
  public displayedColumns: string[] = [
    'name',
    'fields',
    'severity',
    'active',
    '_actions',
  ];

  /**
   * ValidationTabComponent constructor.
   *
   * @param apollo Apollo service.
   * @param dialog Dialog service.
   * @param translate Angular translate service.
   * @param snackBar Shared snackbar service.
   */
  constructor(
    private apollo: Apollo,
    private dialog: Dialog,
    private translate: TranslateService,
    private snackBar: SnackbarService
  ) {
    super();
  }

  ngOnInit(): void {
    this.resource = get(history.state, 'resource', null);
    this.rules = this.resource?.uniquenessRules || [];
  }

  /**
   * Opens the modal to add a new uniqueness rule.
   */
  async onAddRule(): Promise<void> {
    const { EditUniquenessRuleModalComponent } = await import(
      '@oort-front/shared'
    );
    const dialogRef = this.dialog.open<UniquenessRule>(
      EditUniquenessRuleModalComponent,
      {
        disableClose: true,
        data: {
          fields: this.resource.fields,
        },
      }
    );
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((rule) => {
      if (rule) {
        this.save([...this.rules, rule]);
      }
    });
  }

  /**
   * Opens the modal to edit an existing uniqueness rule.
   *
   * @param rule the rule to edit
   */
  async onEditRule(rule: UniquenessRule): Promise<void> {
    const { EditUniquenessRuleModalComponent } = await import(
      '@oort-front/shared'
    );
    const dialogRef = this.dialog.open<UniquenessRule>(
      EditUniquenessRuleModalComponent,
      {
        disableClose: true,
        data: {
          rule,
          fields: this.resource.fields,
        },
      }
    );
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((updated) => {
      if (updated) {
        this.save(this.rules.map((r) => (r === rule ? updated : r)));
      }
    });
  }

  /**
   * Asks for confirmation, then deletes a uniqueness rule.
   *
   * @param rule the rule to delete
   */
  async onDeleteRule(rule: UniquenessRule): Promise<void> {
    const { ConfirmModalComponent } = await import('@oort-front/shared');
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translate.instant('common.deleteObject', {
          name: this.translate.instant('components.uniquenessRules.title'),
        }),
        content: this.translate.instant(
          'components.uniquenessRules.delete.confirmationMessage',
          { name: rule.name || rule.fields.join(' + ') }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        confirmVariant: 'danger',
        cancelText: this.translate.instant('components.confirmModal.cancel'),
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.save(this.rules.filter((r) => r !== rule));
      }
    });
  }

  /**
   * Persists the given list of rules.
   *
   * @param rules the new list of uniqueness rules
   */
  private save(rules: UniquenessRule[]): void {
    this.apollo
      .mutate<EditResourceMutationResponse>({
        mutation: EDIT_RESOURCE,
        variables: {
          id: this.resource.id,
          uniquenessRules: rules,
        },
      })
      .subscribe({
        next: ({ errors, data }) => {
          if (errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotUpdated', {
                type: this.translate.instant('common.resource.one'),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectUpdated', {
                type: this.translate.instant('common.resource.one'),
                value: '',
              })
            );
            if (data) {
              this.resource = data.editResource;
              this.rules = this.resource.uniquenessRules || [];
            }
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }
}
