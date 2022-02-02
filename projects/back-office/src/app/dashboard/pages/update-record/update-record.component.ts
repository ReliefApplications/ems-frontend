import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  GetFormByIdQueryResponse,
  GetRecordByIdQueryResponse,
  GetResourceByIdQueryResponse,
  GET_FORM_STRUCTURE,
  GET_RECORD_BY_ID,
  GET_RESOURCE_BY_ID,
} from '../../../graphql/queries';
import { Record, Form, BreadCrumbService } from '@safe/builder';

@Component({
  selector: 'app-update-record',
  templateUrl: './update-record.component.html',
  styleUrls: ['./update-record.component.scss'],
})
export class UpdateRecordComponent implements OnInit {
  // === DATA ===
  public loading = true;
  public id = '';
  public record?: Record;
  public form?: Form;
  public backPath = '';

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private breadCrumb: BreadCrumbService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.backPath = this.router.url.replace(`/update/${this.id}`, '');
    const template = history.state.template;
    if (template) {
      this.apollo
        .watchQuery<GetFormByIdQueryResponse>({
          query: GET_FORM_STRUCTURE,
          variables: {
            id: template,
          },
        })
        .valueChanges.subscribe((res) => {
          this.form = res.data.form;
          this.loading = res.loading;
        });
    }
    if (this.id !== null) {
      this.apollo
        .watchQuery<GetRecordByIdQueryResponse>({
          query: GET_RECORD_BY_ID,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.subscribe((res) => {
          this.record = res.data.record;
          if (!template) {
            this.form = this.record.form || {};
            this.loading = res.loading;
          }
        });
    }

    //Update BreadCrumb route
    this.breadCrumb.changeLast({ name: 'Update record' });
    if (this.route.parent && this.route.parent.parent) {
      const id = (this.route.parent.parent.params as any).value.id;
      console.log(id);
      this.apollo
        .watchQuery<GetResourceByIdQueryResponse>({
          query: GET_RESOURCE_BY_ID,
          variables: {
            id,
          },
        })
        .valueChanges.subscribe((res) => {
          console.log(res.data);
          if (res.data.resource) {
            this.breadCrumb.changeItem(
              { name: res.data.resource.name },
              this.breadCrumb.getLength() - 2
            );
          }
        });
    }
  }
}
