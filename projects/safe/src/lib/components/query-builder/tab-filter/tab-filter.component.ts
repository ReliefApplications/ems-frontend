import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';

/**
 * Component for displaying the filtering options
 */
@Component({
  selector: 'safe-tab-filter',
  templateUrl: './tab-filter.component.html',
  styleUrls: ['./tab-filter.component.scss'],
})
export class SafeTabFilterComponent implements OnInit {
  @Input() form: FormGroup = new FormGroup({});
  @Input() query: any;

  @ViewChild('dateEditor', { static: false }) dateEditor!: TemplateRef<any>;

  public filterFields: any[] = [];

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param queryBuilder This is the service that will be used to build the query.
   */
  constructor(private queryBuilder: QueryBuilderService) {}

  ngOnInit(): void {
    this.queryBuilder.getFilterFields(this.query).then((fields) => {
      const fieldsCpy = cloneDeep(fields);
      this.setCustomEditors(fieldsCpy);
      this.filterFields = fieldsCpy;
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
