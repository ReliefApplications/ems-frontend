import { Component, OnInit, Input, Inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import {
  GET_RECORD_BY_ID,
  GetRecordByIdQueryResponse,
} from './graphql/queries';
import { ToPageFromWidgetService } from '../../../services/to-page-from-widget/to-page-from-widget.service';

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
  resultText = '';

  public environment: any;

  /**
   * Constructor for safe-editor component
   *
   * @param sanitizer Dom sanitizer instance
   * @param environment Environment specific data
   * @param apollo Apollo instance
   * @param toPageService Used to handle redirecting to pages from widgets
   */
  constructor(
    private sanitizer: DomSanitizer,
    @Inject('environment') environment: any,
    private apollo: Apollo,
    private toPageService: ToPageFromWidgetService
  ) {
    this.environment = environment;
  }

  /** Sanitize the text. */
  async ngOnInit(): Promise<void> {
    if (!this.record) {
      this.safeText = this.sanitizer.bypassSecurityTrustHtml(
        await this.toPageService.applyPage(this.text)
      );
      return;
    }

    this.apollo
      .query<GetRecordByIdQueryResponse>({
        query: GET_RECORD_BY_ID,
        variables: {
          id: this.record,
        },
      })
      .subscribe(async (res) => {
        const regex = /{{data\.(.*?)}}/g;
        const data = res.data?.record.data || {};
        // replace all {{data.<field>}} with the value from the data
        const textWithAddedData = this.text.replace(regex, (match) => {
          const field = match.replace('{{data.', '').replace('}}', '');
          return data[field] || match;
        });
        this.safeText = this.sanitizer.bypassSecurityTrustHtml(
          await this.toPageService.applyPage(textWithAddedData)
        );
      });
  }
}
