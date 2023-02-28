import { Component, Input, OnInit } from '@angular/core';

/**
 * This component is used to preview the style of a query
 */
@Component({
  selector: 'safe-query-style-preview',
  templateUrl: './query-style-preview.component.html',
  styleUrls: ['./query-style-preview.component.scss'],
})
export class SafeQueryStylePreviewComponent implements OnInit {
  @Input() style: any;
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
