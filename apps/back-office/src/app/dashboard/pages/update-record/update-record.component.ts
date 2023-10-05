import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import {
  Record,
  Form,
  BreadcrumbService,
  FormQueryResponse,
  RecordQueryResponse,
} from '@oort-front/shared';
import { ActivatedRoute } from '@angular/router';
import { GET_FORM_STRUCTURE, GET_RECORD_BY_ID } from './graphql/queries';

/**
 * Update record view.
 */
@Component({
  selector: 'app-update-record',
  templateUrl: './update-record.component.html',
  styleUrls: ['./update-record.component.scss'],
})
export class UpdateRecordComponent implements OnInit {
  /** Loading indicator */
  public loading = true;
  /** Current record id */
  public id = '';
  /** Current record */
  public record?: Record;
  /** Current form */
  public form?: Form;

  /**
   * Update record view.
   *
   * @param apollo Used to get the form and the record data
   * @param route Used to get url params.
   * @param breadcrumbService Shared breadcrumb service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    const template = history.state?.template;
    if (template) {
      this.apollo
        .watchQuery<FormQueryResponse>({
          query: GET_FORM_STRUCTURE,
          variables: {
            id: template,
          },
        })
        .valueChanges.subscribe(({ data, loading }) => {
          this.form = data.form;
          this.breadcrumbService.setBreadcrumb(
            '@resource',
            this.form.name as string
          );
          this.loading = loading;
        });
    }
    if (this.id !== null) {
      this.apollo
        .watchQuery<RecordQueryResponse>({
          query: GET_RECORD_BY_ID,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.subscribe(({ data, loading }) => {
          this.record = data.record;
          this.breadcrumbService.setBreadcrumb(
            '@record',
            this.record.incrementalId as string
          );
          this.breadcrumbService.setBreadcrumb(
            '@form',
            this.record.form?.name as string
          );
          this.breadcrumbService.setBreadcrumb(
            '@resource',
            this.record.form?.name as string
          );
          if (!template) {
            this.form = this.record.form || {};
            this.loading = loading;
          }
        });
    }
  }
}
