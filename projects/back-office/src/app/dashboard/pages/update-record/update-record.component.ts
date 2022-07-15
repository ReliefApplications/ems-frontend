import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  GetFormByIdQueryResponse,
  GetRecordByIdQueryResponse,
  GET_FORM_STRUCTURE,
  GET_RECORD_BY_ID,
} from '../../../graphql/queries';
import { Record, Form, SafeBreadcrumbService } from '@safe/builder';

/**
 * Component which will be used at record update.
 */
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

  /**
   * UpdateRecordComponent constructor.
   *
   * @param apollo Used to get the form and the record data
   * @param route Used to get url params.
   * @param router Used to change the app route.
   * @param breadcrumbService Used to update the breadcrumb component.
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: SafeBreadcrumbService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
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
          this.breadcrumbService.setBreadcrumb(
            '@resource',
            this.form.name as string
          );
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
          this.breadcrumbService.setBreadcrumb(
            '@record',
            this.record.incrementalId as string
          );
          this.breadcrumbService.setBreadcrumb(
            '@resource',
            this.record.form?.name as string
          );
          if (!template) {
            this.form = this.record.form || {};
            this.loading = res.loading;
          }
        });
    }
  }
}
