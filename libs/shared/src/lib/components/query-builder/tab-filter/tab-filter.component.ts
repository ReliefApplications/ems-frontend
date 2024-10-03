import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import {
  Field,
  QueryBuilderService,
} from '../../../services/query-builder/query-builder.service';

/**
 * Component for displaying the filtering options
 */
@Component({
  selector: 'shared-tab-filter',
  templateUrl: './tab-filter.component.html',
  styleUrls: ['./tab-filter.component.scss'],
})
export class TabFilterComponent implements OnInit {
  /** Form group */
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  /** Query */
  @Input() query: any;
  /** Disable fields */
  @Input() isDisable = false;

  /** Date editor */
  @ViewChild('dateEditor', { static: false }) dateEditor!: TemplateRef<any>;

  /** List of filter fields */
  public filterFields: Field[] = [];

  /** Loading status of the filter fields */
  public loading = true;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param queryBuilder This is the service that will be used to build the query.
   */
  constructor(private queryBuilder: QueryBuilderService) {}

  ngOnInit(): void {
    this.queryBuilder.getFilterFields(this.query).then((fields) => {
      const cloneFields = cloneDeep(fields);
      this.setCustomEditors(cloneFields);
      this.filterFields = cloneFields;
      this.loading = false;
    });
  }

  /**
   * Set custom editors for some fields.
   *
   * @param fields list of fields.
   */
  private setCustomEditors(fields: any[]): void {
    for (const field of fields) {
      if (field.fields) {
        this.setCustomEditors(field.fields);
      } else {
        switch (field.editor) {
          case 'date':
          case 'datetime': {
            Object.assign(field, { filter: { template: this.dateEditor } });
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  }
}
