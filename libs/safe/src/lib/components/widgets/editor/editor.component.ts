import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import {
  GET_RECORD_BY_ID,
  GetRecordByIdQueryResponse,
} from './graphql/queries';

/**
 * Text widget component using KendoUI
 */
@Component({
  selector: 'safe-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class SafeEditorComponent implements OnInit {
  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() public title = '';
  @Input() public text = '';
  @Input() public record = '';

  // === TEXT SANITIZED ===
  public safeText: SafeHtml = '';

  /**
   * Constructor for safe-editor component
   *
   * @param sanitizer Dom sanitizer instance
   * @param apollo Apollo instance
   */
  constructor(private sanitizer: DomSanitizer, private apollo: Apollo) {}

  /** Sanitize the text. */
  ngOnInit(): void {
    if (!this.record) {
      this.safeText = this.sanitizer.bypassSecurityTrustHtml(this.text);
      return;
    }

    this.apollo
      .query<GetRecordByIdQueryResponse>({
        query: GET_RECORD_BY_ID,
        variables: {
          id: this.record,
        },
      })
      .subscribe((res) => {
        const regex = /{{data\.(.*?)}}/g;
        const data = res.data?.record.data || {};
        // replace all {{data.<field>}} with the value from the data
        const textWithAddedData = this.text.replace(regex, (match) => {
          const field = match.replace('{{data.', '').replace('}}', '');
          return data[field] || match;
        });
        this.safeText =
          this.sanitizer.bypassSecurityTrustHtml(textWithAddedData);
      });
  }
}
