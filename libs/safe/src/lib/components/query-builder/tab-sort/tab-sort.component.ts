import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';

/** Fields that should not be sorted upon */
const UNSORTABLE_FIELDS = ['resource', 'resources'];

/**
 * Component that handles sorting
 */
@Component({
  selector: 'safe-tab-sort',
  templateUrl: './tab-sort.component.html',
  styleUrls: ['./tab-sort.component.scss'],
})
export class SafeTabSortComponent implements OnInit {
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  @Input() query: any;
  @Input() showLimit = false;

  public fields: any[] = [];

  /**
   * Component that handles sorting on the query builder
   *
   * @param queryBuilder Shared query builder service
   */
  constructor(private queryBuilder: QueryBuilderService) {}

  ngOnInit(): void {
    console.log(this.form.getRawValue());
    this.queryBuilder
      .getFilterFields(this.form.getRawValue())
      .then((fields) => {
        this.fields = fields.filter(
          (field) => field.type && !UNSORTABLE_FIELDS.includes(field.type)
        );
      });
  }
}
