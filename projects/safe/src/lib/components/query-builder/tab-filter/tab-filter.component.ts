import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { get } from 'lodash';
import { SafeGridService } from '../../../services/grid.service';
import { QueryBuilderService } from '../../../services/query-builder.service';

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
   * @param gridService Shared grid service
   */
  constructor(
    private queryBuilder: QueryBuilderService,
    private gridService: SafeGridService
  ) {}

  ngOnInit(): void {
    // TODO: move somewhere else
    if (this.query) {
      const sourceQuery = this.queryBuilder.getQuerySource(this.query);
      if (sourceQuery) {
        sourceQuery.subscribe(async (res: any) => {
          for (const field in res.data) {
            if (Object.prototype.hasOwnProperty.call(res.data, field)) {
              const source = get(res.data[field], '_source', null);
              if (source) {
                this.queryBuilder.getQueryMetaData(source).subscribe((res2) => {
                  if (res2.data.form) {
                    const filterFields = get(res2.data.form, 'metadata', [])
                      .filter((x: any) => x.filterable !== false)
                      .map((x: any) => ({ ...x }));
                    this.setCustomEditors(filterFields);
                    this.filterFields = filterFields;
                  }
                  if (res2.data.resource) {
                    const filterFields = get(res2.data.resource, 'metadata', [])
                      .filter((x: any) => x.filterable !== false)
                      .map((x: any) => ({ ...x }));
                    this.setCustomEditors(filterFields);
                    this.filterFields = filterFields;
                  }
                  // await this.gridService.populateMetaFields(this.metaFields);
                });
              }
            }
          }
        });
      } else {
        this.filterFields = [];
      }
    } else {
      // this.gridService.populateMetaFields(this.metaFields);
      this.filterFields = [];
    }
  }

  /**
   * Set custom editors for some fields.
   *
   * @param fields list of fields
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
