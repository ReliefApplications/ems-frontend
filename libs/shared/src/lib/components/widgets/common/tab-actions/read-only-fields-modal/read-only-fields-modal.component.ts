import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ListBoxModule,
  ListBoxToolbarConfig,
} from '@progress/kendo-angular-listbox';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertModule, ButtonModule, DialogModule } from '@oort-front/ui';
import get from 'lodash/get';
import { prettifyLabel } from '../../../../../utils/prettify';
import { DISABLED_FIELDS } from '../../../../../services/grid/grid.service';
import { resolveLocalizedString } from '../../../../../models/localized-string.model';

/** Field displayed in one of the two listboxes */
interface ListBoxField {
  /** Field name, used as unique identifier */
  name: string;
  /** Prettified label displayed to the user */
  label: string;
}

/**
 * Modal allowing the admin to choose which fields of the query
 * should stay read-only during inline edition, regardless of the
 * user's actual update permissions on those fields.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ListBoxModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    AlertModule,
  ],
  selector: 'shared-read-only-fields-modal',
  templateUrl: './read-only-fields-modal.component.html',
  styleUrls: ['./read-only-fields-modal.component.scss'],
})
export class ReadOnlyFieldsModalComponent implements OnInit {
  /** Fields available for selection, not yet marked as read-only */
  public availableFields: ListBoxField[] = [];
  /** Fields marked as read-only */
  public selectedFields: ListBoxField[] = [];
  /** Listbox toolbar settings */
  public toolbarSettings: ListBoxToolbarConfig = {
    position: 'right',
    tools: ['transferFrom', 'transferTo', 'transferAllFrom', 'transferAllTo'],
  };

  /**
   * Modal allowing the admin to choose which fields of the query
   * should stay read-only during inline edition.
   *
   * @param dialogRef CDK dialog ref
   * @param data Injected dialog data
   * @param data.fields Raw list of query fields ( as exposed by the query builder service )
   * @param data.readOnlyFields Names of fields currently marked as read-only
   * @param translate ngx-translate service, used to resolve localized field labels
   */
  constructor(
    public dialogRef: DialogRef<string[]>,
    @Inject(DIALOG_DATA)
    public data: {
      fields: any[];
      readOnlyFields: string[];
    },
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const readOnlyFields = this.data.readOnlyFields || [];
    // Only scalar fields can be edited inline, and structural fields
    // ( id, createdAt... ) are never editable, so there is no point
    // in listing them as selectable candidates.
    const scalarFields: ListBoxField[] = (this.data.fields || [])
      .filter(
        (f) =>
          get(f, 'type.kind', f.kind) === 'SCALAR' &&
          !DISABLED_FIELDS.includes(f.name)
      )
      .map((f) => ({
        name: f.name,
        // Layout fields carry a custom label, either as a plain string or
        // localized per language; fall back to the prettified name without it
        label:
          resolveLocalizedString(f.label, this.translate.currentLang) ||
          prettifyLabel(f.name),
      }));
    this.selectedFields = scalarFields.filter((f) =>
      readOnlyFields.includes(f.name)
    );
    this.availableFields = scalarFields.filter(
      (f) => !readOnlyFields.includes(f.name)
    );
  }

  /** Close the modal without saving. */
  onClose(): void {
    this.dialogRef.close();
  }

  /** Save the selected read-only fields and close the modal. */
  onSave(): void {
    this.dialogRef.close(this.selectedFields.map((f) => f.name));
  }
}
