import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'who-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
/*  Text widget using KendoUI.
*/
export class WhoEditorComponent implements OnInit {

  // === WIDGET CONFIGURATION ===
  @Input() public title: string;
  @Input() public text: string;

  // === TEXT SANITIZED ===
  public safeText: SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  /*  Sanitize the text.
  */
  ngOnInit(): void {
    this.safeText = this.sanitizer.bypassSecurityTrustHtml(this.text);
  }
}
