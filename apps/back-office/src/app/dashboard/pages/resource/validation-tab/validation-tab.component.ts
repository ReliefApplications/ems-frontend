import { Component, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Apollo } from 'apollo-angular';
import get from 'lodash/get';
import { Observable, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import {
  AddUniquenessRuleMutationResponse,
  DeleteUniquenessRuleMutationResponse,
  EditUniquenessRuleMutationResponse,
  Metadata,
  Resource,
  ResourceQueryResponse,
  UnsubscribeComponent,
  UniquenessRule,
} from '@oort-front/shared';
import { GET_RESOURCE_UNIQUENESS_RULES } from './graphql/queries';
import {
  ADD_UNIQUENESS_RULE,
  DELETE_UNIQUENESS_RULE,
  EDIT_UNIQUENESS_RULE,
} from './graphql/mutations';

/**
 * Validation tab of resource page. Lists the scoped uniqueness rules
 * configured on the resource: one or more fields that must be unique
 * (alone, or in combination) across all records of the resource,
 * optionally restricted to records matching a condition or checked as a
 * date-range overlap, and whether a violation should block saving or only
 * warn the user.
 *
 * Rules are loaded each time the tab is opened, and added, edited or deleted
 * one by one: the list is then loaded again.
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
  /** Loading state */
  public loading = true;
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
    this.fetchRules();
  }

  /**
   * Loads the uniqueness rules of the resource, along with the fields they
   * can use.
   */
  private fetchRules(): void {
    if (!this.resource?.id) {
      this.loading = false;
      return;
    }
    this.loading = true;
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE_UNIQUENESS_RULES,
        variables: { id: this.resource.id },
        // Rules must always be up to date when opening the tab
        fetchPolicy: 'network-only',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data, errors }) => {
          if (errors?.length) {
            this.snackBar.openSnackBar(errors[0].message, { error: true });
          } else if (data?.resource) {
            this.resource = { ...this.resource, ...data.resource };
            this.rules = data.resource.uniquenessRules || [];
          }
          this.loading = false;
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.loading = false;
        },
      });
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
          filterFields: this.filterFields,
        },
      }
    );
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((rule) => {
      if (rule) {
        this.handleMutation(
          this.apollo.mutate<AddUniquenessRuleMutationResponse>({
            mutation: ADD_UNIQUENESS_RULE,
            variables: { resource: this.resource.id, rule },
          }),
          {
            success: 'common.notifications.objectCreated',
            error: 'common.notifications.objectNotCreated',
          },
          this.getRuleName(rule)
        );
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
          filterFields: this.filterFields,
        },
      }
    );
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((updated) => {
      if (updated) {
        this.handleMutation(
          this.apollo.mutate<EditUniquenessRuleMutationResponse>({
            mutation: EDIT_UNIQUENESS_RULE,
            variables: {
              resource: this.resource.id,
              id: rule.id,
              rule: updated,
            },
          }),
          {
            success: 'common.notifications.objectUpdated',
            error: 'common.notifications.objectNotUpdated',
          },
          this.getRuleName(updated)
        );
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
          name: this.translate.instant('components.uniquenessRules.one'),
        }),
        content: this.translate.instant(
          'components.uniquenessRules.delete.confirmationMessage',
          { name: this.getRuleName(rule) }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        confirmVariant: 'danger',
        cancelText: this.translate.instant('components.confirmModal.cancel'),
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.handleMutation(
          this.apollo.mutate<DeleteUniquenessRuleMutationResponse>({
            mutation: DELETE_UNIQUENESS_RULE,
            variables: { resource: this.resource.id, id: rule.id },
          }),
          {
            success: 'common.notifications.objectDeleted',
            error: 'common.notifications.objectNotDeleted',
          },
          this.getRuleName(rule)
        );
      }
    });
  }

  /**
   * Fields rules can be restricted with, as expected by the filter builder:
   * the fields of the resource itself, as rules are checked on the data of a
   * record before it is saved.
   *
   * @returns fields available in the filter of a rule
   */
  private get filterFields(): Metadata[] {
    const fieldNames = (this.resource.fields || []).map((x: any) => x.name);
    return (this.resource.metadata || []).filter(
      (x) => x.filterable !== false && fieldNames.includes(x.name)
    );
  }

  /**
   * Gets the name to display for a rule: its own name, or its fields.
   *
   * @param rule uniqueness rule
   * @returns name of the rule
   */
  private getRuleName(rule: UniquenessRule): string {
    return rule.name || rule.fields.join(' + ');
  }

  /**
   * Sends a mutation on a single rule, notifies the user of its result, and
   * loads the rules again.
   *
   * @param mutation mutation to send
   * @param messages translation keys of the notifications
   * @param messages.success notification displayed when the mutation succeeds
   * @param messages.error notification displayed when the mutation fails
   * @param name name of the rule
   */
  private handleMutation(
    mutation: Observable<{ errors?: readonly { message: string }[] }>,
    messages: { success: string; error: string },
    name: string
  ): void {
    const type = this.translate.instant('components.uniquenessRules.one');
    mutation.pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ errors }) => {
        if (errors?.length) {
          this.snackBar.openSnackBar(
            this.translate.instant(messages.error, {
              type,
              value: name,
              error: errors[0].message,
            }),
            { error: true }
          );
        } else {
          this.snackBar.openSnackBar(
            this.translate.instant(messages.success, { type, value: name })
          );
        }
        // The list may have changed even if the mutation failed ( e.g. rule
        // deleted by someone else )
        this.fetchRules();
      },
      error: (err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
      },
    });
  }
}
