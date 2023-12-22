import { Component, Input, OnInit } from '@angular/core';

/**
 * This component is used to preview the style of a query
 */
@Component({
  selector: 'shared-query-style-preview',
  templateUrl: './query-style-preview.component.html',
  styleUrls: ['./query-style-preview.component.scss'],
})
export class QueryStylePreviewComponent implements OnInit {
  /** The style to preview */
  @Input() style: any;
  /** The html style */
  public htmlStyle: any;

  ngOnInit(): void {
    this.htmlStyle = {
      'background-color': this.style.background?.color,
      color: this.style.text?.color,
      'font-weight': this.style.text?.bold && 'bold',
      'text-decoration': this.style.text?.underline && 'underline',
      'font-style': this.style.text?.italic && 'italic',
    };
  }
}
