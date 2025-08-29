import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  TooltipModule,
} from '@oort-front/ui';
import { fileExplorerView } from '../types/file-explorer-view.type';
import { FileExplorerWidgetComponent } from '../file-explorer-widget/file-explorer-widget.component';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Apollo } from 'apollo-angular';
import { Form, FormQueryResponse } from '../../../models/form.model';
import { GET_FORM_BY_ID } from './graphql/queries';
import { Dialog } from '@angular/cdk/dialog';
import { AuthService } from '../../../services/auth/auth.service';
import get from 'lodash/get';

/** Default recipients */
const DEFAULT_RECIPIENTS = ['ems2@who.int'];

/** Default subject */
const DEFAULT_SUBJECT =
  'Access Request: Permission to Add Records to “{{data.form}}”';

/** Default body */
const DEFAULT_BODY =
  `Dear EMS Team,\n\n` +
  `Can you please give me permission to add new records to the {{data.form}} form?\n\n` +
  `(Insert reason you're requesting access)\n\n` +
  `Thank you for your consideration.\n\n{{data.user}}`;

/**
 * File explorer widget toolbar.
 */
@Component({
  selector: 'shared-file-explorer-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    IconModule,
    FormWrapperModule,
    ButtonModule,
    ReactiveFormsModule,
    TranslateModule,
    TooltipModule,
    SelectMenuModule,
  ],
  templateUrl: './file-explorer-toolbar.component.html',
  styleUrls: ['./file-explorer-toolbar.component.scss'],
})
export class FileExplorerToolbarComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges
{
  /** File explorer view */
  @Input() view: fileExplorerView = 'list';
  /** Sort descriptor */
  @Input() sort: SortDescriptor[] = [];
  /** Form id */
  @Input() formId?: string;
  /** Search control */
  public searchControl: FormControl = new FormControl();
  /** Sort field control */
  public sortFieldControl: FormControl = new FormControl();
  /** Form binding, optional */
  public form?: Form;
  /** Uploading state */
  public uploading = false;
  /** Parent component */
  private parent: FileExplorerWidgetComponent | null = inject(
    FileExplorerWidgetComponent,
    { optional: true }
  );
  /** Apollo service */
  private apollo = inject(Apollo);
  /** Dialog service */
  private dialog = inject(Dialog);
  /** Auth service */
  private auth = inject(AuthService);

  ngOnInit(): void {
    // Subscribe to search control value changes
    this.searchControl.valueChanges
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (this.parent) {
          this.parent.onFilterChange({
            search: value,
          });
        }
      });
    // Fetch form if provided, and check permissions
    if (this.formId) {
      this.apollo
        .query<FormQueryResponse>({
          query: GET_FORM_BY_ID,
          variables: {
            id: this.formId,
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          if (data.form) {
            this.form = data.form;
          }
        });
    }
  }

  ngOnChanges(): void {
    this.sortFieldControl.setValue(this.sort[0]?.field);
  }

  /**
   * Update view
   *
   * @param view selected view
   */
  public onChangeView(view: fileExplorerView) {
    if (this.parent) {
      this.parent.view = view;
    }
  }

  /**
   * Update sort field
   *
   * @param field selected field
   */
  public onSortChange(field: string) {
    this.parent?.onSortChange([
      {
        field: field,
        dir: 'asc',
      },
    ]);
  }

  /**
   * Toggle sort direction
   */
  public onSortDirChange() {
    this.parent?.onSortChange([
      {
        field: this.sort[0]?.field,
        dir: this.sort[0]?.dir === 'asc' ? 'desc' : 'asc',
      },
    ]);
  }

  /**
   * On upload, open form
   */
  public async onUpload() {
    this.uploading = true;
    if (!this.formId) {
      return;
    }

    const { FormModalComponent } = await import(
      '../../form-modal/form-modal.component'
    );
    const dialogRef = this.dialog.open(FormModalComponent, {
      disableClose: true,
      data: {
        template: this.formId,
        askForConfirm: false,
      },
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        // If a new record is created, reload data
        this.parent?.page.next(1);
      }
      this.uploading = false;
    });
  }

  /**
   * Request access to the form, opening email client
   */
  public onRequestAccess() {
    if (!this.form) {
      return;
    }
    const recipients = (
      Array.isArray(
        get(this.parent?.settings.accessRequestForm, 'recipients')
      ) && get(this.parent?.settings.accessRequestForm, 'recipients').length > 0
        ? get(this.parent?.settings.accessRequestForm, 'recipients')
        : DEFAULT_RECIPIENTS
    ).join(',');
    const subjectTemplate =
      get(this.parent?.settings.accessRequestForm, 'subject') ||
      DEFAULT_SUBJECT;
    const bodyTemplate =
      get(this.parent?.settings.accessRequestForm, 'body') || DEFAULT_BODY;
    const subject = encodeURIComponent(this.parseTemplate(subjectTemplate));
    const body = encodeURIComponent(this.parseTemplate(bodyTemplate));
    window.open(`mailto:${recipients}?subject=${subject}&body=${body}`);
  }

  /**
   * Parse template field with values
   *
   * @param text Template field text
   * @returns Parsed text
   */
  private parseTemplate(text: string) {
    const regex = /{{data\.(.*?)}}/g;
    const currentUser = this.auth.userValue?.name;
    const values = {
      user: currentUser,
      form: (this.form as Form).name,
    };
    text = text.replace(regex, (match, p1) => {
      // Replace the key with correct value
      return get(values, p1, '');
    });
    return text;
  }
}
