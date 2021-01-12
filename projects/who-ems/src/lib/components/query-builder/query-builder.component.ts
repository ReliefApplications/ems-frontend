import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { QueryBuilderService } from '../../services/query-builder.service';

@Component({
  selector: 'who-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class WhoQueryBuilderComponent implements OnInit {

  // === QUERY BUILDER ===
  public availableQueries: Observable<any[]>;
  public availableFields: any[];

  @Input() form: FormGroup;

  constructor(private queryBuilder: QueryBuilderService) { }

  ngOnInit(): void {
    this.availableQueries = this.queryBuilder.availableQueries;
    this.availableQueries.subscribe((res) => {
      if (res) {
      this.availableFields = this.queryBuilder.getFields(this.form.value.name);
      }
    });
    this.form.controls.name.valueChanges.subscribe((res) => {
      this.availableFields = this.queryBuilder.getFields(res);
    });
  }

}
