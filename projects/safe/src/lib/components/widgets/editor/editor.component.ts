import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'safe-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
/** Text widget using KendoUI. */
export class SafeEditorComponent implements OnInit {
  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() public title = '';
  @Input() public text = '';

  // === TEXT SANITIZED ===
  public safeText: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  /** Sanitize the text. */
  ngOnInit(): void {
    this.safeText = this.sanitizer.bypassSecurityTrustHtml(this.text);
  }
}
